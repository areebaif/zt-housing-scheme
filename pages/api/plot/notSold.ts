// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";
import { ReturnError } from "../customer/all";

export interface NotSoldPlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  plot_status: string;
  value: string;
  label: string;
}

export default async function notSoldPlots(
  req: NextApiRequest,
  res: NextApiResponse<NotSoldPlotsSelectFields[] | ReturnError>
) {
  try {
    const data = await prisma.plot.findMany({
      where: {
        plot_status: "not_sold",
      },
      select: {
        id: true,
        dimension: true,
        square_feet: true,
        plot_status: true,
      },
    });
    const formattedData = data.map((plot) => {
      return {
        ...plot,
        value: plot.id.toString(),
        label: plot.id.toString(),
      };
    });

    res.status(200).json(formattedData);
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
