// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot, Status, Customer, Payments, Payment_Plan } from "@prisma/client";

import { prisma } from "../../../db/prisma";
import { TableRowItem } from "@/components/TableRowsUpsert";
import { PlotDetail } from "../plot/[id]";

export default async function addPayment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const payment = req.body.payment as TableRowItem[];
    const customerId = req.body.customerId as string;
    const plotId = req.body.plotId as string;
    const parsedCustomerId = parseInt(customerId);
    const parsedPlotId = parseInt(plotId);

    const parsedTableRows = payment.map((item) => {
      return {
        payment_date: item.dateISOString,
        payment_value: item.value!,
        plot_id: parsedPlotId,
        customer_id: parsedCustomerId,
        description: item.description,
      };
    });

    const updatePayment = await prisma.payments.createMany({
      data: parsedTableRows,
    });

    res.status(201).json({ created: true });
  } catch (err) {
    //TODO: error handling
  }
}
