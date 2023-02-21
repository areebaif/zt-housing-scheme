// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Payment_Plan, Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { PostReturnType } from "../payment/add";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { AllPlotId } from "@/components/PlotIdPage/PlotUpsertForm/PlotUpsertForm";

export interface PlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  status: string;
}

// export interface FormPostProps {
//   plotId: AllPlotId[];
//   sellPrice: number;
//   soldDateString: string;
//   customer: {
//     customerCNIC: string;
//     customerName: string;
//     sonOf: string;
//     newCustomer: boolean;
//   };
//   paymentPlan: TableRowItem[];
//   isEditPaymentPlan: boolean;
// }

export default async function upsertPlots(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const { customer, paymentPlan } = req.body;
    const plotId = req.body.plotId as AllPlotId[];
    const sellPrice = req.body.sellPrice as number;
    const soldDateString = req.body.soldDateString as string;
    // things to check for
    // 1 new customer existing customer

    //const parsedPlotId = parseInt(plotId);
    // check existing customer or new customer
    let customerId: number;

    if (!customer.newCustomer) {
      const customerVal = await prisma.customer.findUnique({
        where: { cnic: customer.customerCNIC },
      });

      if (!customerVal?.id)
        throw new Error("cannot find customer with supplied Id");
      customerId = customerVal.id;
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
    const saleMaxId = await prisma.sale.aggregate({
      _max: {
        id: true,
      },
    });
    const saleInsertId = saleMaxId._max.id ? saleMaxId._max.id + 1 : 1;
    // add sale reciept
    const sale = prisma.sale.create({
      data: {
        id: saleInsertId,
        customer_id: customerId,
        sold_date: soldDateString,
        total_sale_price: sellPrice,
      },
    });
    // update Plots
    const updatePlot = plotId.map((plot) => {
      return prisma.plot.update({
        where: {
          id: plot.id,
        },
        data: {
          sale_price: plot.sellPrice,
          plot_status: "partially_paid",
          sale_id: saleInsertId,
        },
      });
    });

    const paymentPlanArr: Payment_Plan[] = paymentPlan.map(
      (item: TableRowItem) => {
        return {
          payment_type: item.paymentType,
          sale_id: saleInsertId,
          payment_date: item.dateISOString,
          payment_value: item.value,
        };
      }
    );

    const payment_plan = prisma.payment_Plan.createMany({
      data: paymentPlanArr,
    });

    if (!customer.newCustomer) {
      await prisma.$transaction([...updatePlot, payment_plan, sale]);
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
        ...updatePlot,
        payment_plan,
        sale,
      ]);
    }
    res.status(201).json({ created: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please trey again" });
  }
}
