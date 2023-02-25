// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot, Status, Customer, Payments, Payment_Plan } from "@prisma/client";
import { ReturnError } from "../customer/all";
import { prisma } from "../../../db/prisma";

export interface PlotDetail {
  plot: Plot[];
  sale?: {
    sold_price: number;
    sold_date: Date | null;
    plotSaleId: number;
  };
  customer?: Customer | null;
  payment_history?: Payments[];
  payment_plan?: Payment_Plan[];
}

export default async function allPosts(
  req: NextApiRequest,
  res: NextApiResponse<PlotDetail | ReturnError>
) {
  try {
    const plotId = req.query.id as string;

    const plot = await prisma.plot.findUnique({
      where: {
        id: parseInt(plotId),
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
      const paymentPlan = await prisma.payment_Plan.findMany({
        where: {
          sale_id: saleId,
        },
        orderBy: {
          payment_date: "asc",
        },
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
        payment_plan: paymentPlan,
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
