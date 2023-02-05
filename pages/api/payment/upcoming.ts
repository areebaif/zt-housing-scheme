import type { NextApiRequest, NextApiResponse } from "next";
import { Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";

export default async function allCustomers(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const currentDate = new Date().toISOString();

  const upcomingPayments = await prisma.payment_Plan.findMany({
    where: {
      payment_date: { gte: currentDate },
    },
  });
  const latePayments =
    //console.log(data);
    res.status(200).json({});
}
