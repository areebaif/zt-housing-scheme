// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Payment_Plan, Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { PostReturnType } from "../payment/add";
import { PaymentType } from "@prisma/client";
import { TableRowItem } from "@/components/TableRowsUpsert";

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
    // things to check for
    // 1 new customer existing customer
    // 2 development charges?
    // 3 if plot paid in full when sold

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
      data:
        developmentCharges + downPayment !== sellPrice
          ? {
              customer_id: customerId,
              status: "partially_paid",
              sold_date: soldDateString,
              sold_price: sellPrice,
              //development_charges: parseInt(developmentCharges),
            }
          : {
              customer_id: customerId,
              status: "fully_paid",
              sold_date: soldDateString,
              fully_sold_date: soldDateString,
              sold_price: sellPrice,
            },
    });
    const addPayment = prisma.payments.createMany({
      data:
        developmentCharges + downPayment !== sellPrice
          ? {
              payment_type: PaymentType.down_payment,
              payment_value: downPayment,
              customer_id: customerId,
              plot_id: parsedPlotId,
              payment_date: soldDateString,
            }
          : developmentCharges && downPayment
          ? [
              {
                payment_type: PaymentType.down_payment,
                payment_value: downPayment,
                customer_id: customerId,
                plot_id: parsedPlotId,
                payment_date: soldDateString,
              },
              {
                payment_type: PaymentType.development_charge,
                payment_value: developmentCharges,
                customer_id: customerId,
                plot_id: parsedPlotId,
                payment_date: soldDateString,
              },
            ]
          : {
              payment_type: PaymentType.down_payment,
              payment_value: downPayment,
              customer_id: customerId,
              plot_id: parsedPlotId,
              payment_date: soldDateString,
            },
    });
    let paymentPlanArray = [];
    const paymentPlanParse = paymentPlan.map((item: TableRowItem) => {
      return {
        payment_date: item.dateISOString,
        payment_type: item.paymentType,
        payment_value: item.value,
        plot_id: parsedPlotId,
        customer_id: customerId,
      };
    });
    let paymentPlanArr: Payment_Plan[];
    // if (developmentCharges) {
    paymentPlanArray = [
      {
        payment_type: PaymentType.down_payment,
        payment_value: downPayment,
        customer_id: customerId,
        plot_id: parsedPlotId,
        payment_date: soldDateString,
      },
      ...paymentPlanParse,
      {
        payment_type: PaymentType.development_charge,
        payment_value: parseInt(developmentCharges),
        customer_id: customerId,
        plot_id: parsedPlotId,
        payment_date: paymentPlanParse.length
          ? paymentPlanParse[paymentPlanParse.length - 1].payment_date
          : soldDateString,
      },
    ];
    paymentPlanArr = [...paymentPlanArray];
    // } else {
    //   paymentPlanArray = [
    //     {
    //       payment_type: PaymentType.down_payment,
    //       payment_value: downPayment,
    //       customer_id: customerId,
    //       plot_id: parsedPlotId,
    //       payment_date: soldDateString,
    //     },
    //     ...paymentPlanParse,
    //   ];
    // paymentPlanArr = [...paymentPlanArray];
    //}
    const payment_plan = prisma.payment_Plan.createMany({
      data: paymentPlanArr,
    });

    if (!customer.newCustomer) {
      await prisma.$transaction([updatePlot, addPayment, payment_plan]);
    } else {
      const addCustomer = prisma.customer.create({
        data: {
          id: customerId,
          name: customer.customerName,
          son_of: customer.sonOf,
          cnic: customer.customerCNIC,
        },
      });
      await prisma.$transaction([
        addCustomer,
        updatePlot,
        addPayment,
        payment_plan,
      ]);
    }
    res.status(201).json({ created: true });
  } catch (err) {
    //TODO: error handling
    console.log(err);
  }
}
