// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";
import { TableRowItem } from "@/components/TableRowsUpsert";

export interface PostReturnType {
  created: true;
}

export default async function addPayment(
  req: NextApiRequest,
  res: NextApiResponse<any>
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
        payment_type: item.paymentType,
        plot_id: parsedPlotId,
        customer_id: parsedCustomerId,
        description: item.description,
      };
    });

    const updatePayment = await prisma.payments.createMany({
      data: parsedTableRows,
    });

    const totalPayments = await prisma.$queryRaw<
      { total_payment_value: number }[]
    >`select sum(payment_value) as total_payment_value from Payments where plot_id=${parsedPlotId};`;
    const soldPrice = await prisma.plot.findUnique({
      where: {
        id: parsedPlotId,
      },
      select: {
        sold_price: true,
      },
    });

    if (totalPayments[0].total_payment_value! >= soldPrice?.sold_price!) {
      const sortedPayments = [...payment];

      sortedPayments.sort((a: TableRowItem, b: TableRowItem) => {
        const date1: any = new Date(a.dateISOString);
        const date2: any = new Date(b.dateISOString);

        return date1 - date2;
      });
      const soldDate = sortedPayments[sortedPayments.length - 1].dateISOString;

      const fullySoldPlot = await prisma.plot.update({
        where: {
          id: parsedPlotId,
        },
        data: {
          status: "fully_paid",
          fully_sold_date: soldDate,
        },
      });
    }
    res.status(201).json({ created: true });
  } catch (err) {
    //TODO: error handling
  }
}
