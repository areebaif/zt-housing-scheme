// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";

export interface PostReturnType {
  created?: true;
  error?: string;
}

export default async function addPayment(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const payment = req.body.payment as TableRowItem[];
    const saleId = req.body.saleId as number;
    let sumPaymentToBeAdded = 0;

    const parsedTableRows = payment.map((item) => {
      item.value
        ? (sumPaymentToBeAdded = sumPaymentToBeAdded + item.value)
        : (sumPaymentToBeAdded = sumPaymentToBeAdded + 0);
      return {
        description: item.description,
        payment_type: item.paymentType,
        sale_id: saleId,
        payment_date: item.dateISOString,
        payment_value: item.value!,
      };
    });

    const totalPayments = await prisma.$queryRaw<
      { total_payment_value: number }[]
    >`select sum(payment_value) as total_payment_value from Payments where sale_id=${saleId};`;
    const soldPrice = await prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      select: {
        total_sale_price: true,
      },
    });
    // we need to check if adding these payments will ensure that plot is fully sold
    // If it is fully sold then we need to update plot status , hence these transactions need to happen in a lock
    const sumAfterPaymentAdded =
      totalPayments[0].total_payment_value + sumPaymentToBeAdded;

    if (sumAfterPaymentAdded >= soldPrice?.total_sale_price!) {
      const sortedPayments = [...payment];
      sortedPayments.sort((a: TableRowItem, b: TableRowItem) => {
        const date1: any = new Date(a.dateISOString);
        const date2: any = new Date(b.dateISOString);

        return date1 - date2;
      });
      const soldDate = sortedPayments[sortedPayments.length - 1].dateISOString;

      const updatePayment = prisma.payments.createMany({
        data: parsedTableRows,
      });
      const fullySoldPlot = prisma.plot.updateMany({
        where: {
          sale_id: saleId,
        },
        data: {
          plot_status: "fully_paid",
          fully_sold_date: soldDate,
        },
      });
      await prisma.$transaction([updatePayment, fullySoldPlot]);
      res.status(201).json({ created: true });
    } else {
      const updatePayment = await prisma.payments.createMany({
        data: parsedTableRows,
      });
      res.status(201).json({ created: true });
    }
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
