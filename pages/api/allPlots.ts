// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Status, Plot } from "@prisma/client";
import internal from "stream";
import { prisma } from "../../db/prisma";

export default async function allPosts(
  req: NextApiRequest,
  res: NextApiResponse<Plot[]>
) {
  const data = await prisma.plot.findMany({});
  res.status(200).json(data);
}
