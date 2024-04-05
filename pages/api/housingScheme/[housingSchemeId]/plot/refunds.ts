// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentType, PaymentStatus } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { ReturnError } from "@/pages/api/customers";
import { PostReturnType } from "@/pages/api/payments";

type RefundPlotSQLQuery = {
  sale_id: number;
  //sale_price: number;
  plotId: string;
  total_sale_price: number;
  sold_date: string;
  name: string;
  cnic: string;
  son_of: string;
  paymentId: number;
  payment_type: PaymentType;
  description: string;
  payment_date: string;
  payment_value: number;
  payment_status: PaymentStatus;
};

export type refundPlotData = {
  sale: {
    sale_id: number;
    //sale_price: number;
    plotId: string;
    total_sale_price: number;
    sold_date: string;
  };
  customer: {
    name: string;
    cnic: string;
    son_of: string;
  };
  payments: {
    paymentId: number;
    payment_type: PaymentType;
    description: string;
    payment_date: string;
    payment_value: number;
    payment_status: PaymentStatus;
  }[];
};

export default async function refundSummary(
  req: NextApiRequest,
  res: NextApiResponse<
    { data: refundPlotData[] } | ReturnError | PostReturnType
  >
) {
  try {
    if (req.method === "GET") {
      const id = req.query.housingSchemeId;

      if (typeof id !== "string") {
        return res.status(404).json({
          error: "type mismatch: expected housingSchemeId as string",
        });
      }
      const HousingId = id as string;
      const housingSchemeId = parseInt(HousingId);
      const plotData = await prisma.$queryRaw<
        RefundPlotSQLQuery[]
      >`select RescindedSalePlotMetdata.sale_id, GROUP_CONCAT(RescindedSalePlotMetdata.plot_id) as plotId, Sale.total_sale_price, Sale.sold_date ,Customer.name,Customer.cnic,Customer.son_of,  Payments.id as paymentId,Payments.payment_type, Payments.description, Payments.payment_date, Payments.payment_value, Payments.payment_status from RescindedSalePlotMetdata  join Sale on RescindedSalePlotMetdata.sale_id=Sale.id join Customer on Sale.customer_id=Customer.id join Payments on Payments.sale_id=Sale.id and Sale.housing_scheme= ${housingSchemeId}  Group By RescindedSalePlotMetdata.sale_id,Sale.total_sale_price,Customer.name,Customer.cnic,Customer.son_of, Payments.id, Sale.sold_date`;

      const parsedPlotData: refundPlotData[] = [];

      plotData.forEach((item, index) => {
        const {
          sale_id,
          //sale_price,
          plotId,
          total_sale_price,
          sold_date,
          name,
          cnic,
          son_of,
          paymentId,
          payment_type,
          description,
          payment_date,
          payment_value,
          payment_status,
        } = item;
        if (
          index === 0 ||
          (item.sale_id !== plotData[index - 1].sale_id && index !== 0)
        ) {
          parsedPlotData.push({
            sale: {
              sale_id,
              //sale_price,
              plotId,
              total_sale_price,
              sold_date,
            },
            customer: { name, cnic, son_of },
            payments: [
              {
                paymentId,
                payment_type,
                description,
                payment_date,
                payment_value,
                payment_status,
              },
            ],
          });
          return;
        }
        if (item.sale_id === plotData[index - 1].sale_id) {
          parsedPlotData[parsedPlotData.length - 1].payments.push({
            paymentId,
            payment_type,
            description,
            payment_date,
            payment_value,
            payment_status,
          });
        }
      });

      res.status(200).json({ data: parsedPlotData });
    }
    if (req.method === "POST") {
      const saleId = req.body.saleId;
      const refundPayments = req.body.refundPayments as string[];
      const revertSalePlotMetaData = await prisma.plot.findMany({
        where: {
          sale_id: parseInt(saleId),
        },
      });
      const revertSalePlotMetaDataParsed = revertSalePlotMetaData.map(
        (item) => ({
          plot_id: item.id,
          sale_id: item.sale_id!,
          sale_price: item.sale_price!,
        })
      );
      if (!revertSalePlotMetaData.length)
        throw new Error("no sale found with the provided sale id");
      // start transactions that need to happen in a lock
      const changePlotStatus = prisma.plot.updateMany({
        where: {
          sale_id: parseInt(saleId),
        },
        data: {
          plot_status: "not_sold",
          sale_id: null,
          sale_price: null,
          fully_sold_date: null,
        },
      });

      const changeSaleStatus = prisma.sale.update({
        where: { id: parseInt(saleId) },
        data: {
          sale_status: "cancel",
        },
      });

      const createRescindSalePlotMetaData =
        prisma.rescindedSalePlotMetdata.createMany({
          data: revertSalePlotMetaDataParsed,
        });

      // refund payments
      const changePaymentStatus = refundPayments.map((paymentId) => {
        return prisma.payments.update({
          where: { id: parseInt(paymentId) },
          data: {
            payment_status: "refund",
          },
        });
      });

      await prisma.$transaction([
        changePlotStatus,
        changeSaleStatus,
        createRescindSalePlotMetaData,
        ...changePaymentStatus,
      ]);

      res.status(200).json({ created: true });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
