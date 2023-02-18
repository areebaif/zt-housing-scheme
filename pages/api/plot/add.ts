// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Payment_Plan, Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { PostReturnType } from "../payment/add";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";

export interface PlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  status: string;
}

export default async function upsertPlots(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const { plotId, sellPrice, soldDateString, customer, paymentPlan } =
      req.body;
    // things to check for
    // 1 new customer existing customer

    const parsedPlotId = parseInt(plotId);
    // check existing customer or new customer
    let customerId: number | undefined;

    if (!customer.newCustomer) {
      const customerVal = await prisma.customer.findUnique({
        where: { cnic: customer.customerCNIC },
      });
      customerId = customerVal?.id;
      if (!customerId) throw new Error("cannot find customer with supplied Id");
    } else {
      const customerMaxId = await prisma.customer.aggregate({
        _max: {
          id: true,
        },
      });
      const customerInsertId = customerMaxId._max.id
        ? customerMaxId._max.id + 1
        : 1;
      customerId = customerInsertId;
    }

    const updatePlot = prisma.plot.update({
      where: {
        id: parsedPlotId,
      },
      data: {
        customer_id: customerId,
        status: "partially_paid",
        sold_date: soldDateString,
        fully_sold_date: soldDateString,
        sold_price: sellPrice,
      },
    });

    const paymentPlanArr: Payment_Plan[] = paymentPlan.map(
      (item: TableRowItem) => {
        return {
          payment_date: item.dateISOString,
          payment_type: item.paymentType,
          payment_value: item.value,
          plot_id: parsedPlotId,
          customer_id: customerId,
        };
      }
    );

    const payment_plan = prisma.payment_Plan.createMany({
      data: paymentPlanArr,
    });

    if (!customer.newCustomer) {
      await prisma.$transaction([updatePlot, payment_plan]);
    } else {
      const addCustomer = prisma.customer.create({
        data: {
          id: customerId,
          name: customer.customerName,
          son_of: customer.sonOf,
          cnic: customer.customerCNIC,
        },
      });
      await prisma.$transaction([addCustomer, updatePlot, payment_plan]);
    }
    res.status(201).json({ created: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please trey again" });
  }
}
