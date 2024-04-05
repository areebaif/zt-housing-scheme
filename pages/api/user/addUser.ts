import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";

export interface PostReturnType {
  created?: true;
  error?: string;
}

export default async function addPayment(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const verifiedUser = req.body.verifiedUser;
    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        verifiedUser,
      },
    });
    res.status(201).json({ created: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
