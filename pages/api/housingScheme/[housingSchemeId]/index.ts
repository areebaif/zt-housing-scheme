import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
import { ReturnError } from "@/pages/api/customers";
import { PlotsSelectFields } from "..";

export default async function allPlots(
  req: NextApiRequest,
  res: NextApiResponse<PlotsSelectFields[] | ReturnError>
) {
  try {
    const { housingSchemeId } = req.query;
    if (typeof housingSchemeId !== "string") {
      return res.status(404).json({
        error: "incorrect query parameter, expect query parameter as string",
      });
    }
    const id = housingSchemeId as string;
    const data = await prisma.plot.findMany({
      select: {
        id: true,
        dimension: true,
        square_feet: true,
        plot_status: true,
      },
      where: {
        housing_scheme: parseInt(id),
      },
    });
    res.status(200).json(data);
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
