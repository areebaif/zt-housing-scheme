// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";
import { ReturnError } from "../customer/all";
import { PostReturnType } from "./add";

export default async function refundPayments(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType | ReturnError>
) {
  try {
    const refundPayments = req.body.refundPayments as string[];

    // refund payments
    const changePaymentStatus = refundPayments.map((paymentId) => {
      return prisma.payments.update({
        where: { id: parseInt(paymentId) },
        data: {
          payment_status: "refund",
        },
      });
    });
    await prisma.$transaction([...changePaymentStatus]);
    res.status(200).json({ created: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
