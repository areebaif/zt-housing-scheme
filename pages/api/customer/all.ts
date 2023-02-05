// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot } from "@prisma/client";

import { prisma } from "../../../db/prisma";
import { createIncrementalCompilerHost } from "typescript";

export interface CustomerSelectFields {
  id: number;
  cnic: string;
  value: string;
}

export default async function allCustomers(
  req: NextApiRequest,
  res: NextApiResponse<CustomerSelectFields[]>
) {
  const data = await prisma.customer.findMany({
    select: { id: true, cnic: true },
  });
  const mappedData = data.map((element) => {
    return { id: element.id, cnic: element.cnic, value: element.cnic };
  });
  res.status(200).json(mappedData);
}
