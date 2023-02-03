import type { NextApiRequest, NextApiResponse } from "next";
import { Status, Plot, Customer } from "@prisma/client";
import { prisma } from "../../../db/prisma";

export default async function newCustomer(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {
    name,
    son_of,
    cnic,

    status,
    sold_date,
    sold_price,
    payment_value,
    payment_description,
    plotId,
  } = req.body;
  const date = new Date(sold_date);
  const customerMaxId = await prisma.customer.aggregate({
    _max: {
      id: true,
    },
  });
  const customerInsertId = customerMaxId._max.id
    ? customerMaxId._max.id + 1
    : 1;
  const addCustomer = prisma.customer.create({
    data: {
      id: customerInsertId,
      name,
      son_of,
      cnic,
    },
  });
  const updatePlot = prisma.plot.update({
    where: {
      id: plotId,
    },
    data: {
      customer_id: customerInsertId,
      status: status,
      sold_date: date,
      sold_price: sold_price,
    },
  });
  const addPayment = prisma.payments.create({
    data: {
      description: payment_description,
      payment_value: payment_value,
      customer_id: customerInsertId,
      plot_id: plotId,
    },
  });
  await prisma.$transaction([addCustomer, updatePlot, addPayment]);

  res.status(201).json({ data: "ok" });
}
