import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
import { ReturnError } from "@/pages/api/customers";
import { HousingScheme } from "@prisma/client";

export interface PlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  plot_status: string;
}

export default async function listHousingScheme(
  req: NextApiRequest,
  res: NextApiResponse<HousingScheme[] | ReturnError>
) {
  try {
    const data = await prisma.housingScheme.findMany({});
    res.status(200).json(data);
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
