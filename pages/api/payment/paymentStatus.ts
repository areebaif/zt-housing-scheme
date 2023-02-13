import { PaymentType } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";

export interface PaymentStatus {
  paymentStatus: PaymentSchedule[];
}
export enum PaymentValueStatus {
  partiallyPaid = "partial payment",
  notPaid = "not paid",
}

export type SQLQueryPlannedPayments = {
  id: number;
  plot_id: number;
  customer_id: number;
  payment_type: PaymentType;
  payment_date: string;
  payment_value: number | null;
  description: string | null;
  payment_plan_recurring_payment_days: number | null;
};

type CustomerPayments = {
  name: string;
  son_of: string;
  cnic: string;
  lastPaymentDate?: string;
  paymentValueStatus: PaymentValueStatus;
  paymentCollectionValue: number | null;
};

export type PaymentSchedule = SQLQueryPlannedPayments & CustomerPayments;
// export type PaymentSchedule =  {
//   id: number;
//   plot_id: number;
//   customer_id: number;
//   payment_type: PaymentType;
//   payment_date: string;
//   payment_value: number | null;
//   description: string | null;
//   payment_plan_recurring_payment_days: number | null;
//   name: string;
//   son_of: string;
//   cnic: string;
//   lastPaymentDate?: string;
//   paymentValueStatus: PaymentValueStatus;
//   paymentCollectionValue: number | null;
// }

interface SQLQueryPayments {
  totalPaid: number;
  lastPaymentDate: string;
  plot_id: number;
  customer_id: number;
  name: string;
  son_of: string;
  cnic: string;
}

type AdditionalSQLQueryPayments = {
  totalPlannedPayments: number;
  remainingPayment?: number;
};
type calculatedTotalPayments = SQLQueryPayments & AdditionalSQLQueryPayments;

type SQLQueryTotalPlannedPayment = {
  payment_value: number;
  plot_id: number;
};

export default async function allCustomers(
  req: NextApiRequest,
  res: NextApiResponse<PaymentStatus>
) {
  const paymentPlanTotalValueByPlot = await prisma.$queryRaw<
    SQLQueryTotalPlannedPayment[]
  >`
  select sum(payment_value) as payment_value, plot_id from Payment_Plan group by plot_id;`;

  const paymentMetaData = await prisma.$queryRaw<
    SQLQueryPayments[]
  >`select sum(payment_value) as totalPaid, MAX(Payments.payment_date) as lastPaymentDate ,Payments.plot_id, Payments.customer_id, Customer.name, Customer.son_of, Customer.cnic from Payments join Customer on Customer.id = Payments.customer_id  group by plot_id,customer_id, Customer.name, Customer.son_of, Customer.cnic`;

  const paymentPlanByPlot = await prisma.$queryRaw<
    SQLQueryPlannedPayments[]
  >`select * from Payment_Plan order by payment_date, plot_id;`;

  const calculatedTotalPayments = paymentPlanTotalValueByPlot.map(
    (planPayments) => {
      let returnObject: calculatedTotalPayments;
      const payment = paymentMetaData.map((payment) => {
        if (payment.plot_id === planPayments.plot_id) {
          returnObject = {
            ...payment,
            totalPlannedPayments: planPayments.payment_value,
          };

          returnObject.remainingPayment =
            returnObject.totalPlannedPayments - returnObject.totalPaid;
          return returnObject;
        }
      });
      const parsedPayments = payment.filter((item) => item !== undefined);

      return parsedPayments;
    }
  );
  const totalPayment = calculatedTotalPayments.flat();

  const status: PaymentSchedule[][] = totalPayment.map((item) => {
    const plot_id = item?.plot_id;
    const totalPaid = item?.totalPaid;
    let sum = 0;
    const returnObject: PaymentSchedule[] = [];
    paymentPlanByPlot.forEach((element, index) => {
      if (plot_id === element.plot_id) {
        sum = sum + (element.payment_value ? element.payment_value : 0);
        const difference = sum - totalPaid!;
        if (sum >= totalPaid! && difference > 0) {
          const test = { ...element };
          const obj: PaymentSchedule = {
            ...element,
            name: item?.name!,
            son_of: item?.son_of!,
            cnic: item?.cnic!,
            lastPaymentDate: item?.lastPaymentDate,
            paymentCollectionValue: null,
            paymentValueStatus:
              test.payment_value! - difference === 0 &&
              returnObject.length === 0
                ? PaymentValueStatus.notPaid
                : test.payment_value! - difference > 0 &&
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
  paymentStatusSortedByDate.sort((a: PaymentSchedule, b: PaymentSchedule) => {
    const date1: any = new Date(a.payment_date);
    const date2: any = new Date(b.payment_date);

    return date1 - date2;
  });

  res.status(200).json({ paymentStatus: paymentStatusSortedByDate });
}
