import { PaymentType, Payment_Plan } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";

export enum PaymentValueStatus {
  partiallyPaid = "partial payment",
  notPaid = "not paid",
}

export type PaymentStatusByPlot = {
  paymentStatus: PaymentStatusBySaleIdCustomerId[];
};

export type PaymentPlanBySaleIdCustomerId = {
  // the Id is paymentPlanId
  id: number;
  payment_type: PaymentType;
  sale_id: number;
  payment_date: string;
  payment_value: number | null;
  plot_id: string | undefined;
  customer_id: number | undefined;
};

type CustomerPayments = {
  name: string;
  son_of: string;
  cnic: string;
  lastPaymentDate?: string;
  paymentValueStatus: PaymentValueStatus;
  paymentCollectionValue: number | null;
};

export type PaymentStatusBySaleIdCustomerId = PaymentPlanBySaleIdCustomerId &
  CustomerPayments;

type SumPaymentHistory = {
  totalPaid: number | null;
  lastPaymentDate: string | null;
  sale_id: number;
  customer_id: number;
  name: string;
  son_of: string;
  cnic: string;
};

type SumPaymentHistoryWithPlotId = {
  totalPaid: number | null;
  lastPaymentDate: string | null;
  plot_id: number[];
  sale_id: number;
  customer_id: number;
  name: string;
  son_of: string;
  cnic: string;
};

type RemainingPayments = {
  totalPlannedPayments: number;
  remainingPayment?: number;
};
type PaymentHistoryWithRemainingPayments = SumPaymentHistoryWithPlotId &
  RemainingPayments;

export default async function paymentStatus(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const id = req.query.housingSchemeId;

    if (typeof id !== "string") {
      return res
        .status(404)
        .json({ error: "type mismatch: expected housingSchemeId as string" });
    }
    const HousingId = id as string;
    const housingSchemeId = parseInt(HousingId);

    // [{ _sum: { payment_value: 8600000 }, sale_id: 1 }]
    const sumPaymentPlanBySaleId: { _sum: number; sale_id: number }[] =
      await prisma.$queryRaw`select sum(payment_value) as _sum, sale_id from Payment_Plan where sale_id in (select Sale.id as sale_id from Sale where Sale.Housing_scheme = ${housingSchemeId} ) group by sale_id`;
    /*
    {
    id: 23,
    payment_type: 'installment',
    sale_id: 5,
    payment_date: 2023-08-03T16:17:53.000Z,
    payment_value: 440000,
    created_at: 2023-02-25T16:21:20.300Z,
    updated_at: 2023-02-25T16:21:20.300Z
  },
    */
    const paymentPlanBySaleId: Payment_Plan[] =
      await prisma.$queryRaw`select * from Payment_Plan where sale_id in (select Sale.id as sale_id from Sale where Sale.Housing_scheme = ${housingSchemeId} ) ORDER BY payment_date ASC, sale_id ASC;`;

    // totalPaid	lastPaymentDate	sale_id	customer_id,	name	son_of	cnic
    // we are doing left join becuase there are plots which have been sold but they dont have any payments
    const sumPaymentHistoryBySaleId = await prisma.$queryRaw<
      SumPaymentHistory[]
    >`select Sale.id as sale_id,Sale.customer_id,Customer.name,Customer.cnic,Customer.son_of, SUM(Payments.payment_value) as totalPaid, MAX(Payments.payment_date) as lastPaymentDate from Sale left join Payments on Sale.id=Payments.sale_id join Customer on Customer.id=Sale.customer_id and Sale.housing_scheme = ${housingSchemeId} group by Sale.id,Customer.id;`;

    // the plot metadata
    // since refunded plots no longer have sale_id this works
    const plotData = await prisma.plot.findMany({
      select: { id: true, sale_id: true },
      where: { housing_scheme: housingSchemeId },
    });

    const sumPaymentHistoryBySaleIdCustomerId: SumPaymentHistoryWithPlotId[] =
      [];

    sumPaymentHistoryBySaleId.forEach((el) => {
      plotData.forEach((item) => {
        if (item.sale_id === el.sale_id) {
          if (sumPaymentHistoryBySaleIdCustomerId.length === 0) {
            const obj = { ...el, plot_id: [item.id] };
            sumPaymentHistoryBySaleIdCustomerId.push(obj);
          } else {
            const lastPlot =
              sumPaymentHistoryBySaleIdCustomerId[
                sumPaymentHistoryBySaleIdCustomerId.length - 1
              ];
            const lastplotSaleId = lastPlot.sale_id;
            if (lastplotSaleId === el.sale_id) {
              sumPaymentHistoryBySaleIdCustomerId[
                sumPaymentHistoryBySaleIdCustomerId.length - 1
              ].plot_id.push(item.id);
            } else {
              const obj = { ...el, plot_id: [item.id] };
              sumPaymentHistoryBySaleIdCustomerId.push(obj);
            }
          }
        }
      });
    });

    const paymentHistoryWithRemainingPayments = sumPaymentPlanBySaleId.map(
      (sumPaymentPlan) => {
        let returnObject: PaymentHistoryWithRemainingPayments;
        const payment = sumPaymentHistoryBySaleIdCustomerId.map((payments) => {
          if (payments.sale_id === sumPaymentPlan.sale_id) {
            returnObject = {
              ...payments,
              totalPlannedPayments: sumPaymentPlan._sum
                ? sumPaymentPlan._sum
                : 0,
            };
            returnObject.remainingPayment = returnObject.totalPaid
              ? returnObject.totalPlannedPayments - returnObject.totalPaid
              : returnObject.totalPlannedPayments - 0;
            return returnObject;
          }
        });
        const parsedPayments = payment.filter((item) => item !== undefined);

        return parsedPayments;
      }
    );
    const paymentHistoryAndRemainingPayments =
      paymentHistoryWithRemainingPayments.flat();

    const status: PaymentStatusBySaleIdCustomerId[][] =
      paymentHistoryAndRemainingPayments.map((item) => {
        const sale_id = item?.sale_id;
        const totalPaid = item?.totalPaid;
        let sum = 0;
        const returnObject: PaymentStatusBySaleIdCustomerId[] = [];
        paymentPlanBySaleId.forEach((element, index) => {
          if (sale_id === element.sale_id) {
            sum = sum + (element.payment_value ? element.payment_value : 0);
            const difference = sum - totalPaid!;
            if (sum >= totalPaid! && difference > 0) {
              const payPlan = { ...element };
              const plot_id = String(item?.plot_id);
              const obj: PaymentStatusBySaleIdCustomerId = {
                // destructuing paymentPlanbySaleId
                id: element.id,
                payment_type: element.payment_type,
                sale_id: element.sale_id,
                payment_date: element.payment_date
                  ? element.payment_date.toISOString()
                  : "",
                payment_value: element.payment_value,
                // new values
                customer_id: item?.customer_id,
                plot_id: plot_id,
                name: item?.name!,
                son_of: item?.son_of!,
                cnic: item?.cnic!,
                lastPaymentDate: item?.lastPaymentDate
                  ? item?.lastPaymentDate
                  : undefined,
                paymentCollectionValue: null,
                paymentValueStatus:
                  payPlan.payment_value! - difference === 0 &&
                  returnObject.length === 0
                    ? PaymentValueStatus.notPaid
                    : payPlan.payment_value! - difference > 0 &&
                      returnObject.length === 0
                    ? PaymentValueStatus.partiallyPaid
                    : PaymentValueStatus.notPaid,
              };
              (obj.paymentCollectionValue =
                obj.paymentValueStatus === PaymentValueStatus.partiallyPaid
                  ? difference
                  : obj.payment_value),
                returnObject.push(obj);
            }
          }
        });

        return returnObject;
      });

    const paymentStatus = status.flat();
    const paymentStatusSortedByDate = [...paymentStatus];
    paymentStatusSortedByDate.sort(
      (
        a: PaymentStatusBySaleIdCustomerId,
        b: PaymentStatusBySaleIdCustomerId
      ) => {
        const date1: any = new Date(a.payment_date);
        const date2: any = new Date(b.payment_date);

        return date1 - date2;
      }
    );

    res.status(200).json({ paymentStatus: paymentStatusSortedByDate });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
