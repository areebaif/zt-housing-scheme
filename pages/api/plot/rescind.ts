// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";
import { ReturnError } from "../customer/all";
import { PostReturnType } from "../payment/add";

export default async function allPlots(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType | ReturnError>
) {
  try {
    const saleId = req.body.saleId;
    const refundPayments = req.body.refundPayments as string[];
    const revertSalePlotMetaData = await prisma.plot.findMany({
      where: {
        sale_id: parseInt(saleId),
      },
    });
    const revertSalePlotMetaDataParsed = revertSalePlotMetaData.map((item) => ({
      plot_id: item.id,
      sale_id: item.sale_id!,
      sale_price: item.sale_price!,
    }));
    if (!revertSalePlotMetaData.length)
      throw new Error("no sale found with the provided sale id");
    // start transactions that need to happen in a lock
    const changePlotStatus = prisma.plot.updateMany({
      where: {
        sale_id: parseInt(saleId),
      },
      data: {
        plot_status: "not_sold",
        sale_id: null,
        sale_price: null,
        fully_sold_date: null,
      },
    });

    const changeSaleStatus = prisma.sale.update({
      where: { id: parseInt(saleId) },
      data: {
        sale_status: "cancel",
      },
    });

    const createRescindSalePlotMetaData =
      prisma.rescindedSalePlotMetdata.createMany({
        data: revertSalePlotMetaDataParsed,
      });

    // refund payments
    const changePaymentStatus = refundPayments.map((paymentId) => {
      return prisma.payments.update({
        where: { id: parseInt(paymentId) },
        data: {
          payment_status: "refund",
        },
      });
    });

    await prisma.$transaction([
      changePlotStatus,
      changeSaleStatus,
      createRescindSalePlotMetaData,
      ...changePaymentStatus,
    ]);

    res.status(200).json({ created: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
