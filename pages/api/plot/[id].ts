// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot, Status, Customer, Payments } from "@prisma/client";

import { prisma } from "../../../db/prisma";

interface PlotDetail {
  plot: Plot;
  customer?: Customer | null;
  payments?: Payments[];
}

export default async function allPosts(
  req: NextApiRequest,
  res: NextApiResponse<PlotDetail | { error: "error" }>
) {
  try {
    const plotId = req.query.id as string;
    console.log(" I was hit");

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
      });

      const plotDetail: PlotDetail = {
        plot: plot,
        customer: customer,
        payments: payments,
      };
      res.status(200).json(plotDetail);
    } else {
      res.status(200).json({ plot: plot });
    }
  } catch (err) {
    //TODO: error handling
  }
}
