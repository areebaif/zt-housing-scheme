import type { NextApiRequest, NextApiResponse } from "next";
import { Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { IconTrendingUp3 } from "@tabler/icons";

export interface PaymentSchedule {
  id: number;
  description: string | null;
  plot_id: number;
  customer_id: number;
  // This is returned as string from db
  payment_date: Date;
  payment_value: number | null;
  paymentStatus: string;
  latePayment: string;
  payment_plan_recurring_payment_days: number | null;
  name: string;
  son_of: string;
  cnic: string;
  lastPaymentDate: Date;
}

export default async function allCustomers(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const currentDate = new Date().toISOString();

  const paymentPlanTotalValueByPlot = await prisma.payment_Plan.groupBy({
    by: ["plot_id"],
    _sum: {
      payment_value: true,
    },
  });

  const result: any[] =
    await prisma.$queryRaw`select sum(payment_value) as totalPaid, MAX(Payments.payment_date) as lastPaymentDate ,Payments.plot_id, Payments.customer_id, Customer.name, Customer.son_of, Customer.cnic from Payments join Customer on Customer.id = Payments.customer_id  group by plot_id,customer_id, Customer.name, Customer.son_of, Customer.cnic`;

  const paymentPlanByPlot = await prisma.payment_Plan.findMany({
    orderBy: {
      payment_date: "asc",
    },
  });

  const calculatedTotalPayments = paymentPlanTotalValueByPlot.map(
    (planPayments: any) => {
      let returnObject: any = {};
      result.forEach((payment) => {
        if (payment.plot_id === planPayments.plot_id) {
          returnObject = { ...payment };
          returnObject.totalPlannedPayments = planPayments._sum.payment_value;
          returnObject.remainingPayment =
            returnObject.totalPlannedPayments - returnObject.totalPaid;
          //returnObject.plot_id = payment.plot_id;
        }
      });
      return returnObject;
    }
  );

  const upcoming: PaymentSchedule[] = calculatedTotalPayments.map((item) => {
    const plot_id = item.plot_id;
    const totalPaid = item.totalPaid;
    let sum = 0;
    const returnObject: any = [];
    paymentPlanByPlot.forEach((element, index) => {
      if (plot_id === element.plot_id) {
        sum = sum + (element.payment_value ? element.payment_value : 0);
        if (sum >= totalPaid && sum - totalPaid > 0) {
          const obj: any = {
            ...element,
            name: item.name,
            son_of: item.son_of,
            cnic: item.cnic,
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
  res.status(200).json({ upcomingPayments: upcomingFlatArray });
}
