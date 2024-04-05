// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
import { ReturnError } from "@/pages/api/customers";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { AllPlotId } from "@/components/PlotIdPage/PlotUpsertForm/PlotUpsertForm";
import { CustomerFormPost } from "@/components/PlotIdPage/PlotUpsertForm/PlotUpsertForm";
import { PostReturnType } from "@/pages/api/payments";
import { PaymentPlanSelectFields } from "./edit";

export interface NotSoldPlotsSelectFields {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  plot_status: string;
  value: string;
  label: string;
}

export default async function notSoldPlots(
  req: NextApiRequest,
  res: NextApiResponse<
    NotSoldPlotsSelectFields[] | ReturnError | PostReturnType
  >
) {
  try {
    // filter can be 0 or 1, 0 means unsold
    if (req.method === "GET") {
      const { sold } = req.query;
      if (sold === "0") {
        const data = await prisma.plot.findMany({
          where: {
            plot_status: "not_sold",
          },
          select: {
            id: true,
            dimension: true,
            square_feet: true,
            plot_status: true,
          },
        });
        const formattedData = data.map((plot) => {
          return {
            ...plot,
            value: plot.id.toString(),
            label: plot.id.toString(),
          };
        });

        res.status(200).json(formattedData);
      }
    }
    if (req.method === "POST") {
      const { housingSchemeId } = req.query;
      if (typeof housingSchemeId !== "string") {
        return res.status(404).json({
          error: "incorrect query parameter, expect query parameter as string",
        });
      }
      const id = housingSchemeId as string;
      const paymentPlan = req.body.paymentPlan as TableRowItem[];
      const customer = req.body.customer as CustomerFormPost;
      const plotId = req.body.plotId as AllPlotId[];
      const sellPrice = req.body.sellPrice as number;
      const soldDateString = req.body.soldDateString as string;

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
          housing_scheme: parseInt(id),
        },
      });
      // update Plots
      const updatePlot = plotId.map((plot) => {
        return prisma.plot.update({
          where: {
            plotId: {
              housing_scheme: parseInt(id),
              id: plot.id,
            },
          },
          data: {
            sale_price: plot.sellPrice,
            plot_status: "partially_paid",
            sale_id: saleInsertId,
          },
        });
      });

      const paymentPlanArr: PaymentPlanSelectFields[] = paymentPlan.map(
        (item) => {
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
            address: customer.customerAddress,
            phone_number: customer.customerPhone,
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
    }
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
