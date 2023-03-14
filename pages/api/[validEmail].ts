import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../db/prisma";
import { ReturnError } from "./customer/all";
export default async function validEmail(
  req: NextApiRequest,
  res: NextApiResponse<any | ReturnError>
) {
  try {
    const email = req.query.validEmail as string;
    console.log(email, "email¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡");
    const data = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    console.log(data, "daata!!!!!!!!!!!!!!!!!!!!!!!");
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(200).json({ id: null, email: null });
    }
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
