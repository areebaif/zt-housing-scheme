// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot, Status, Customer, Payments, Payment_Plan } from "@prisma/client";
import { ReturnError } from "../customer/all";
import { prisma } from "../../../db/prisma";

export interface PlotDetail {
  plot: Plot;
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
    const customerId = plot.customer_id;
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });
      const payments = await prisma.payments.findMany({
        where: {
          plot_id: parseInt(plotId),
        },
        orderBy: {
          payment_date: "asc",
        },
      });
      const paymentPlan = await prisma.payment_Plan.findMany({
        where: {
          plot_id: parseInt(plotId),
        },
        orderBy: {
          payment_date: "asc",
        },
      });

      const plotDetail: PlotDetail = {
        plot: plot,
        customer: customer,
        payment_history: payments,
        payment_plan: paymentPlan,
      };
      res.status(200).json(plotDetail);
    } else {
      res.status(200).json({ plot: plot });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ error: "something went wrong please trey again" });
  }
}
