// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot, Status, Customer, Payments, Payment_Plan } from "@prisma/client";
import { ReturnError } from "@/pages/api/customers";
import { prisma } from "@/db/prisma";

export interface PlotDetail {
  plot: Plot[];
  sale?: {
    sold_price: number;
    sold_date: Date | null;
    plotSaleId: number;
  };
  customer?: Customer | null;
  payment_history?: Payments[];
  payment_plan?: PaymentPlan[];
}

type PaymentStatus = {
  status: string;
};
type PaymentPlan = Payment_Plan & PaymentStatus;

export default async function allPosts(
  req: NextApiRequest,
  res: NextApiResponse<PlotDetail | ReturnError>
) {
  try {
    const plotId = req.query.id as string;
    const housingSchemeId = req.query.housingSchemeId as string;

    const plot = await prisma.plot.findUnique({
      where: {
        plotId: {
          id: parseInt(plotId),
          housing_scheme: parseInt(housingSchemeId),
        },
      },
    });
    if (!plot) throw new Error("no plot found with number ");
    const saleId = plot.sale_id;

    if (saleId) {
      const plotSale = await prisma.sale.findUnique({
        where: { id: saleId },
      });

      const customerId = plotSale?.customer_id;

      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });
      const payments = await prisma.payments.findMany({
        where: {
          sale_id: saleId,
        },
        orderBy: {
          payment_date: "asc",
        },
      });
      let sumPayments = 0;
      payments.forEach((item) => {
        sumPayments = sumPayments + item.payment_value;
      });
      const paymentPlan = await prisma.payment_Plan.findMany({
        where: {
          sale_id: saleId,
        },
        orderBy: {
          payment_date: "asc",
        },
      });
      let sumPaymentPlan = 0;
      let lastPaymentPlanValue = paymentPlan[0].payment_value; // index -1
      let firstHit = true;
      let properlyPaid = false;
      const planPaymentStatus = paymentPlan.map((item, index) => {
        // set lastPaymentPlanValue
        if (index - 1 > 0) {
          lastPaymentPlanValue = paymentPlan[index - 1].payment_value;
        }
        // set paymentValue
        item.payment_value
          ? (sumPaymentPlan = sumPaymentPlan + item.payment_value)
          : (sumPaymentPlan = sumPaymentPlan + 0);
        if (sumPayments === 0)
          return {
            ...item,
            status: "not paid",
          };
        if (sumPaymentPlan <= sumPayments) {
          return { ...item, status: "paid" };
        }
        // case where the customer has paid according to payment plan
        if (sumPaymentPlan - sumPayments === item.payment_value) {
          properlyPaid = true;
          return { ...item, status: "not paid" };
        }
        // case where customers have paid partially
        if (sumPaymentPlan - sumPayments > 0 && firstHit && !properlyPaid) {
          firstHit = false;
          return { ...item, status: "partially paid" };
        }
        return { ...item, status: "not paid" };
      });

      const allPlots = await prisma.plot.findMany({
        where: { sale_id: saleId },
      });

      const saleInfo = {
        ...plot,
        sold_price: plotSale?.total_sale_price!,
        sold_date: plotSale?.sold_date!,
        plotSaleId: saleId,
      };

      const plotDetail: PlotDetail = {
        plot: allPlots,
        sale: saleInfo,
        customer: customer,
        payment_history: payments,
        payment_plan: planPaymentStatus,
      };

      res.status(200).json(plotDetail);
    } else {
      res.status(200).json({ plot: [plot] });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
