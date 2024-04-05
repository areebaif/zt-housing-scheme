// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";

export interface CustomerSelectFields {
  id: number;
  value: string;
  name: string;
  son_of: string | null;
  phone: string;
  address: string | null;
}

export type ReturnError = {
  error: String;
};

export default async function allCustomers(
  req: NextApiRequest,
  res: NextApiResponse<CustomerSelectFields[] | ReturnError>
) {
  try {
    const data = await prisma.customer.findMany({
      select: {
        id: true,
        cnic: true,
        name: true,
        son_of: true,
        phone_number: true,
        address: true,
      },
    });
    const mappedData = data.map((element) => {
      return {
        id: element.id,
        //cnic: element.cnic,
        value: element.cnic,
        name: element.name,
        son_of: element.son_of,
        phone: element.phone_number,
        address: element.address,
      };
    });
    res.status(200).json(mappedData);
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please trey again" });
  }
}
