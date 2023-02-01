// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import internal from "stream";
import { prisma } from "../../db/prisma";

enum Status {
  paid = "paid",
  fully_paid = "fully_paid",
  registry_transferred = "registry_transferred",
  not_sold = "not_sold",
}

export interface Plot {
  id: number;
  dimension?: string | null;
  square_feet?: number | null;
  status: string | null;
  sold_date: Date | null;
  fully_sold_date: Date | null;
  sold_price: number | null;
  created_at: string | Date;
  customer_id: number | null;
  registry_transfer_date: Date | null;
  registry_given_to: string | null;
}

export default async function allPosts(
  req: NextApiRequest,
  res: NextApiResponse<Plot[]>
) {
  const data = await prisma.plot.findMany({});
  res.status(200).json(data);
}
