import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentType, Payment_Plan, Plot } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { PostReturnType } from "../payment/add";
import { CustomerFormPost } from "@/components/PlotIdPage/PlotUpsertForm/PlotUpsertForm";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { AllPlotId } from "@/components/PlotIdPage/PlotUpsertForm/PlotUpsertForm";

export type PaymentPlanSelectFields = {
  payment_type: PaymentType;
  sale_id: number;
  payment_date: string;
  payment_value: number | undefined;
};

export type PlotsSelectFields = {
  id: number;
  dimension: string | null;
  square_feet: number | null;
  status: string;
};

export default async function editPlots(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const paymentPlan = req.body.paymentPlan as TableRowItem[];
    const customer = req.body.customer as CustomerFormPost;
    const plotId = req.body.plotId as AllPlotId[];
    const sellPrice = req.body.sellPrice as number;
    const soldDateString = req.body.soldDateString as string;
    const isEditPaymentPlan = req.body.isEditPaymentPlan as boolean;
    const plotSaleId = req.body.plotSaleId as number | undefined;
    const isEditPlotIdDetail = req.body.isEditPlotIdDetail as boolean;

    if (typeof plotSaleId !== "number")
      throw new Error("plotSale id is not defined");

    // check if old customer then cnic exists or new customer then do an entry
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

    // update Sale
    const updateSale = prisma.sale.update({
      where: {
        id: plotSaleId,
      },
      data: {
        customer_id: customerId,
        sold_date: soldDateString,
        total_sale_price: sellPrice,
      },
    });

    const paymentPlanArr: PaymentPlanSelectFields[] = paymentPlan.map(
      (item) => {
        return {
          payment_type: item.paymentType,
          sale_id: plotSaleId,
          payment_date: item.dateISOString,
          payment_value: item.value,
        };
      }
    );

    /* scenarios : new customer, old customer
    // new payment plan , old payent plan
    // new plot id, old plot id
    // I calculated the combinations, There are total 8 combinatons of these 6 values
    */
    const bool = true;
    switch (bool) {
      ////////////// case 1 : new customer, new payment plan, new plots
      case customer.newCustomer && isEditPaymentPlan && isEditPlotIdDetail:
        // delete old payment plan
        const deletePlan = prisma.payment_Plan.deleteMany({
          where: {
            sale_id: plotSaleId,
          },
        });
        // update old plots where status becomes not sold, no sale_id, no sale_price, no fully sold date
        const oldPlotUpdate = prisma.plot.updateMany({
          where: {
            sale_id: plotSaleId,
          },
          data: {
            plot_status: "not_sold",
            sale_id: null,
            sale_price: null,
            fully_sold_date: null,
          },
        });
        // update new plots
        const updateNewPlot = plotId.map((plot) => {
          return prisma.plot.update({
            where: {
              id: plot.id,
            },
            data: {
              sale_price: plot.sellPrice,
              plot_status: "partially_paid",
              sale_id: plotSaleId,
            },
          });
        });

        // create new payment plan
        const new_plan = prisma.payment_Plan.createMany({
          data: paymentPlanArr,
        });
        // create new customer
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
        // do these transactions in a lock
        await prisma.$transaction([
          addCustomer,
          updateSale,
          oldPlotUpdate,
          ...updateNewPlot,
          deletePlan,
          new_plan,
        ]);
        break;

      ////////////// case 2 : new customer, new payment plan, old plots
      case customer.newCustomer && isEditPaymentPlan && !isEditPlotIdDetail:
        // delete old payment plan
        const deleteOldPlan = prisma.payment_Plan.deleteMany({
          where: {
            sale_id: plotSaleId,
          },
        });

        // create new payment plan
        const newPlan = prisma.payment_Plan.createMany({
          data: paymentPlanArr,
        });
        // create new customer
        const addNewCustomer = prisma.customer.create({
          data: {
            id: customerId,
            name: customer.customerName,
            son_of: customer.sonOf,
            cnic: customer.customerCNIC,
            address: customer.customerAddress,
            phone_number: customer.customerPhone,
          },
        });
        // do these transactions in a lock
        await prisma.$transaction([
          addNewCustomer,
          updateSale,
          deleteOldPlan,
          newPlan,
        ]);
        break;

      ////////////// case 3 : new customer, old payment plan, new plots
      case customer.newCustomer && !isEditPaymentPlan && isEditPlotIdDetail:
        // update old plots where status becomes not sold, no sale_id, no sale_price, no fully sold date
        const oldPlot = prisma.plot.updateMany({
          where: {
            sale_id: plotSaleId,
          },
          data: {
            plot_status: "not_sold",
            sale_id: null,
            sale_price: null,
            fully_sold_date: null,
          },
        });
        // update new plots
        const newPlot = plotId.map((plot) => {
          return prisma.plot.update({
            where: {
              id: plot.id,
            },
            data: {
              sale_price: plot.sellPrice,
              plot_status: "partially_paid",
              sale_id: plotSaleId,
            },
          });
        });

        // create new customer
        const addNewCust = prisma.customer.create({
          data: {
            id: customerId,
            name: customer.customerName,
            son_of: customer.sonOf,
            cnic: customer.customerCNIC,
            address: customer.customerAddress,
            phone_number: customer.customerPhone,
          },
        });
        // do these transactions in a lock
        await prisma.$transaction([
          addNewCust,
          updateSale,
          oldPlot,
          ...newPlot,
        ]);
        break;

      ////////////// case 4 : new customer, old payment plan, old plots
      case customer.newCustomer && !isEditPaymentPlan && !isEditPlotIdDetail:
        // create new customer
        const addCust = prisma.customer.create({
          data: {
            id: customerId,
            name: customer.customerName,
            son_of: customer.sonOf,
            cnic: customer.customerCNIC,
            address: customer.customerAddress,
            phone_number: customer.customerPhone,
          },
        });
        // do these transactions in a lock
        await prisma.$transaction([addCust, updateSale]);
        break;

      ////////////// case 5 :  old customer, new payment plan, new plots
      case !customer.newCustomer && isEditPaymentPlan && isEditPlotIdDetail:
        // delete old payment plan
        const delPaymentPlan = prisma.payment_Plan.deleteMany({
          where: {
            sale_id: plotSaleId,
          },
        });
        // update old plots where status becomes not sold, no sale_id, no sale_price, no fully sold date
        const oldPlots = prisma.plot.updateMany({
          where: {
            sale_id: plotSaleId,
          },
          data: {
            plot_status: "not_sold",
            sale_id: null,
            sale_price: null,
            fully_sold_date: null,
          },
        });
        // update new plots
        const newPlots = plotId.map((plot) => {
          return prisma.plot.update({
            where: {
              id: plot.id,
            },
            data: {
              sale_price: plot.sellPrice,
              plot_status: "partially_paid",
              sale_id: plotSaleId,
            },
          });
        });

        // create new payment plan
        const newPaymentPlan = prisma.payment_Plan.createMany({
          data: paymentPlanArr,
        });
        // do these transactions in a lock
        await prisma.$transaction([
          updateSale,
          oldPlots,
          ...newPlots,
          delPaymentPlan,
          newPaymentPlan,
        ]);
        break;

      ////////////// case 6 :  old customer, new payment plan, old plots
      case !customer.newCustomer && isEditPaymentPlan && !isEditPlotIdDetail:
        // delete old payment plan
        const delPayPlan = prisma.payment_Plan.deleteMany({
          where: {
            sale_id: plotSaleId,
          },
        });
        // create new payment plan
        const newPayPlan = prisma.payment_Plan.createMany({
          data: paymentPlanArr,
        });
        // do these transactions in a lock
        await prisma.$transaction([updateSale, delPayPlan, newPayPlan]);
        break;

      ////////////// case 7 :  old customer, old payment plan, new plots
      case !customer.newCustomer && !isEditPaymentPlan && isEditPlotIdDetail:
        // update old plots where status becomes not sold, no sale_id, no sale_price, no fully sold date
        const oldPlotsUpdate = prisma.plot.updateMany({
          where: {
            sale_id: plotSaleId,
          },
          data: {
            plot_status: "not_sold",
            sale_id: null,
            sale_price: null,
            fully_sold_date: null,
          },
        });
        // update new plots
        const newPlotsUpdate = plotId.map((plot) => {
          return prisma.plot.update({
            where: {
              id: plot.id,
            },
            data: {
              sale_price: plot.sellPrice,
              plot_status: "partially_paid",
              sale_id: plotSaleId,
            },
          });
        });

        // do these transactions in a lock
        await prisma.$transaction([
          updateSale,
          oldPlotsUpdate,
          ...newPlotsUpdate,
        ]);
        break;

      ////////////// case 8 :  old customer, old payment plan, new plots
      case !customer.newCustomer && !isEditPaymentPlan && !isEditPlotIdDetail:
        // update old plots where status becomes not sold, no sale_id, no sale_price, no fully sold date

        // do these transactions in a lock
        await prisma.$transaction([updateSale]);
        break;
    }

    res.status(201).json({ created: true });
  } catch (err) {
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
