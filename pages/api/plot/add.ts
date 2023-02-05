// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Plot } from "@prisma/client";

import { prisma } from "../../../db/prisma";

export interface PlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  status: string;
}

export default async function upsertPlots(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log(req.body, " I am body");
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
  const date = new Date(soldDateString);
  const parsedPlotId = parseInt(plotId);

  // check existing customer or new customer
  let customerId: number | undefined;
  if (customer.existingCustomer) {
    const customerVal = await prisma.customer.findUnique({
      where: { cnic: customer.existingCustomer },
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
  // if exisitng customer you will not add customer
  const addCustomer = prisma.customer.create({
    data: {
      id: customerId,
      name: customer.newCustomerName,
      son_of: customer.sonOf,
      cnic: customer.newCustomerCNIC,
    },
  });

  const updatePlot = prisma.plot.update({
    where: {
      id: parsedPlotId,
    },
    data: {
      customer_id: customerId,
      status: "partially_paid",
      sold_date: date,
      sold_price: sellPrice,
      development_charges: parseInt(developmentCharges),
    },
  });
  const addPayment = prisma.payments.create({
    data: {
      description: "down payment",
      payment_value: downPayment,
      customer_id: customerId,
      plot_id: parsedPlotId,
    },
  });
  // which type of payment plan
  // assume payment plan
  let paymentPlanArray = [];
  if (paymentPlan.fixedPaymentPlan.length) {
    const paymentPlanParse = paymentPlan.fixedPaymentPlan.map((item: any) => {
      return {
        payment_date: new Date(item.date),
        payment_value: item.value,
        plot_id: parsedPlotId,
        customer_id: customerId,
      };
    });
    paymentPlanArray = [...paymentPlanParse];
    console.log(paymentPlanArray, "I am payment Plan");
    const payment_plan = prisma.payment_Plan.createMany({
      data: paymentPlanArray,
    });

    if (customer.existingCustomer) {
      await prisma.$transaction([updatePlot, addPayment, payment_plan]);
    } else {
      await prisma.$transaction([
        addCustomer,
        updatePlot,
        addPayment,
        payment_plan,
      ]);
    }
  } else {
    const payment_plan = prisma.payment_Plan.create({
      data: {
        plot_id: parsedPlotId,
        customer_id: customerId,
        payment_plan_recurring_payment_days: parseInt(
          paymentPlan.recurringPaymentPlan
        ),
      },
    });
    if (customer.existingCustomer) {
      await prisma.$transaction([updatePlot, addPayment, payment_plan]);
    } else {
      await prisma.$transaction([
        addCustomer,
        updatePlot,
        addPayment,
        payment_plan,
      ]);
    }
  }

  const data = await prisma.plot.findUnique({
    where: { id: parsedPlotId },
  });
  console.log(data);
  res.status(200).json(data);
}
