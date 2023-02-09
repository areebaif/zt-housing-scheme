import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";

export interface PaymentStatus {
  paymentStatus: PaymentSchedule[];
}

export interface PaymentSchedule {
  id: number;
  description: string | null;
  plot_id: number;
  customer_id: number;
  payment_date: string;
  payment_value: number | null;
  paymentStatus: string;
  latePayment: string;
  payment_plan_recurring_payment_days: number | null;
  name: string;
  son_of: string;
  cnic: string;
  lastPaymentDate: string;
}

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

  const paymentPlanByPlot = await prisma.payment_Plan.findMany({
    orderBy: {
      payment_date: "asc",
    },
  });

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

  const upcoming: PaymentSchedule[] = totalPayment.map((item) => {
    const plot_id = item?.plot_id;
    const totalPaid = item?.totalPaid;
    let sum = 0;
    const returnObject: any = [];
    paymentPlanByPlot.forEach((element, index) => {
      if (plot_id === element.plot_id) {
        sum = sum + (element.payment_value ? element.payment_value : 0);
        if (sum >= totalPaid! && sum - totalPaid! > 0) {
          const obj: any = {
            ...element,
            name: item?.name,
            son_of: item?.son_of,
            cnic: item?.cnic,
          };
          if (returnObject.length === 0) {
            obj.paymentStatus = "partially paid";
            returnObject.push(obj);
          } else {
            obj.paymentStatus = "not paid";
            returnObject.push(obj);
          }
        }
      }
    });
    return returnObject;
  });

  const upcomingFlatArray = upcoming.flat();

  //console.log(data);
  res.status(200).json({ paymentStatus: upcomingFlatArray });
}
