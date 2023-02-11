// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { PostReturnType } from "../payment/add";

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
    const {
      plotId,
      sellPrice,
      soldDateString,
      downPayment,
      customer,
      paymentPlan,
      developmentCharges,
    } = req.body;
    // add sale

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
        sold_price: sellPrice,
        //development_charges: parseInt(developmentCharges),
      },
    });
    // const addPayment = prisma.payments.create({
    //   data: {
    //     description: "down payment",
    //     payment_value: downPayment,
    //     customer_id: customerId,
    //     plot_id: parsedPlotId,
    //     payment_date: soldDateString,
    //   },
    // });
    let paymentPlanArray = [];
    const paymentPlanParse = paymentPlan.map((item: any) => {
      return {
        payment_date: item.dateISOString,
        payment_value: item.value,
        plot_id: parsedPlotId,
        customer_id: customerId,
      };
    });
    paymentPlanArray = [
      {
        description: "down payment",
        payment_value: downPayment,
        customer_id: customerId,
        plot_id: parsedPlotId,
        payment_date: soldDateString,
      },
      ...paymentPlanParse,
      {
        description: "development charges",
        payment_value: parseInt(developmentCharges),
        customer_id: customerId,
        plot_id: parsedPlotId,
        payment_date:
          paymentPlanParse[paymentPlanParse.length - 1].payment_date,
      },
    ];
    const payment_plan = prisma.payment_Plan.createMany({
      data: paymentPlanArray,
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
    //TODO: error handling
    console.log(err);
  }
}
