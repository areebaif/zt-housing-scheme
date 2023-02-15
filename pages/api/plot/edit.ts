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

export default async function editPlots(
  req: NextApiRequest,
  res: NextApiResponse<PostReturnType>
) {
  try {
    const {
      plotId,
      sellPrice,
      soldDateString,
      customer,
      paymentPlan,
      isEditPaymentPlan,
    } = req.body;

    const parsedPlotId = parseInt(plotId);
    // check existing customer or new customer
    let customerId: number | undefined;
    const oldCustomerId = await prisma.plot.findUnique({
      where: { id: parsedPlotId },
    });
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
      },
    });

    const updatePaymentCustomerId = prisma.payments.updateMany({
      where: {
        plot_id: parsedPlotId,
        customer_id: oldCustomerId?.customer_id!,
      },
      data: {
        customer_id: customerId,
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

    const bool = true;
    switch (bool) {
      case !customer.newCustomer && isEditPaymentPlan:
        const deleteCustomerPlan = prisma.payment_Plan.deleteMany({
          where: {
            plot_id: parsedPlotId,
          },
        });
        const payment_plan = prisma.payment_Plan.createMany({
          data: paymentPlanArr,
        });
        await prisma.$transaction([
          updatePlot,
          deleteCustomerPlan,
          payment_plan,
          updatePaymentCustomerId,
        ]);
        break;
      case !customer.newCustomer && !isEditPaymentPlan:
        await prisma.$transaction([updatePlot, updatePaymentCustomerId]);
        break;

      case customer.newCustomer && isEditPaymentPlan:
        const deletePlan = prisma.payment_Plan.deleteMany({
          where: {
            plot_id: parsedPlotId,
          },
        });
        const new_plan = prisma.payment_Plan.createMany({
          data: paymentPlanArr,
        });
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
          updatePaymentCustomerId,
          deletePlan,
          new_plan,
        ]);
        break;

      case customer.newCustomer && !isEditPaymentPlan:
        const newCustomer = prisma.customer.create({
          data: {
            id: customerId,
            name: customer.customerName,
            son_of: customer.sonOf,
            cnic: customer.customerCNIC,
          },
        });
        await prisma.$transaction([
          newCustomer,
          updatePlot,
          updatePaymentCustomerId,
        ]);
        break;
    }
    //     // set data to insert
    //     const newPayment = {
    //       payment_type: PaymentType.development_charge,
    //       payment_value: parseInt(developmentCharges),
    //       customer_id: customerId,
    //       plot_id: parsedPlotId,
    //       payment_date: paymentPlanParse.length
    //         ? paymentPlanParse[paymentPlanParse.length - 1].payment_date
    //         : soldDateString,
    //     };

    //     // find values in database to edit
    //     const chargeExists = await prisma.payment_Plan.findMany({
    //       where: {
    //         plot_id: parsedPlotId,
    //         customer_id: customerId,
    //         payment_type: PaymentType.development_charge,
    //       },
    //       select: {
    //         id: true,
    //       },
    //     });

    //     // update database
    //     const newCustomer = prisma.customer.create({
    //       data: {
    //         id: customerId,
    //         name: customer.customerName,
    //         son_of: customer.sonOf,
    //         cnic: customer.customerCNIC,
    //       },
    //     });

    //     if (chargeExists.length) {
    //       const payment_plan = prisma.payment_Plan.upsert({
    //         where: {
    //           id: chargeExists[0].id,
    //         },
    //         update: {
    //           payment_value: developmentCharges,
    //         },
    //         create: newPayment,
    //       });
    //       await prisma.$transaction([
    //         updatePlot,
    //         updatePaymentCustomerId,
    //         payment_plan,
    //         newCustomer,
    //       ]);
    //     } else {
    //       const payment_plan = prisma.payment_Plan.create({
    //         data: newPayment,
    //       });
    //       await prisma.$transaction([
    //         newCustomer,
    //         updatePlot,
    //         updatePaymentCustomerId,
    //         payment_plan,
    //       ]);
    //     }
    //     break;
    // }
    // if (!customer.newCustomer) {
    //   await prisma.$transaction([
    //     updatePlot,
    //     deleteCustomerPlan,
    //     payment_plan,
    //     updatePaymentCustomerId,
    //   ]);
    // } else {
    //   const addCustomer = prisma.customer.create({
    //     data: {
    //       id: customerId,
    //       name: customer.customerName,
    //       son_of: customer.sonOf,
    //       cnic: customer.customerCNIC,
    //     },
    //   });
    //   await prisma.$transaction([
    //     addCustomer,
    //     updatePlot,
    //     updatePaymentCustomerId,
    //     deleteCustomerPlan,
    //     payment_plan,
    //   ]);
    // }
    res.status(201).json({ created: true });
  } catch (err) {
    console.log(err);
  }
}
