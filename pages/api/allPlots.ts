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

export interface Plots {
  id: number;
  dimension?: string | null;
  square_feet?: number | null;
  status?: Status;
  sold_date?: string | Date;
  fully_sold_date?: string | Date;
  sold_price?: number;
  created_at: string | Date;
  customer_id: number | null;
  registry_transfer_date?: string | Date;
  registry_given_to?: string;
}

export default async function allPosts(
  req: NextApiRequest,
  res: NextApiResponse<Plots[]>
) {
  const data = await prisma.plot.findMany({});
  res.status(200).json(data);
}
