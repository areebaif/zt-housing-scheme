// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";
import { ReturnError } from "../customer/all";

export interface PlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  plot_status: string;
}

export default async function allPlots(
  req: NextApiRequest,
  res: NextApiResponse<PlotsSelectFields[] | ReturnError>
) {
  try {
    const data = await prisma.plot.findMany({
      select: {
        id: true,
        dimension: true,
        square_feet: true,
        plot_status: true,
      },
    });
    res.status(200).json(data);
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
