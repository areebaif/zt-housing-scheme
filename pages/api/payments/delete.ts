// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/db/prisma";

export interface PostReturnType {
  deleted?: true;
  error?: string;
}

export default async function deletePayment(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const paymentId = req.body.paymentId as number;
    // delete record
    await prisma.payments.delete({
      where: {
        id: paymentId,
      },
    });

    res.status(201).json({ deleted: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
