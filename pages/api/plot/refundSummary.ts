// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentType, PaymentStatus } from "@prisma/client";
import { prisma } from "../../../db/prisma";
import { ReturnError } from "../customer/all";

type RefundPlotSQLQuery = {
  sale_id: number;
  sale_price: number;
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

type refundPlotData = {
  sale: {
    sale_id: number;
    sale_price: number;
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
  res: NextApiResponse<{ data: refundPlotData[] } | ReturnError>
) {
  try {
    // , Payments.id as paymentId,Payments.payment_type, Payments.description, Payments.payment_date, Payments.payment_value, Payments.payment_status ,   , Sale.total_sale_price,Customer.name,Customer.cnic,Customer.son_of, ,,, join Sale on RescindedSalePlotMetdata.sale_id=Sale.id join Customer on Sale.customer_id=Customer.id
    const plotData = await prisma.$queryRaw<
      RefundPlotSQLQuery[]
    >`select RescindedSalePlotMetdata.sale_id,RescindedSalePlotMetdata.sale_price, GROUP_CONCAT(RescindedSalePlotMetdata.plot_id) as plotId, Sale.total_sale_price, Sale.sold_date ,Customer.name,Customer.cnic,Customer.son_of,  Payments.id as paymentId,Payments.payment_type, Payments.description, Payments.payment_date, Payments.payment_value, Payments.payment_status from RescindedSalePlotMetdata  join Sale on RescindedSalePlotMetdata.sale_id=Sale.id join Customer on Sale.customer_id=Customer.id join Payments on Payments.sale_id=Sale.id  Group By RescindedSalePlotMetdata.sale_id, RescindedSalePlotMetdata.sale_price,Sale.total_sale_price,Customer.name,Customer.cnic,Customer.son_of, Payments.id, Sale.sold_date `;

    const parsedPlotData: refundPlotData[] = [];

    plotData.forEach((item, index) => {
      const {
        sale_id,
        sale_price,
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
            sale_price,
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
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ error: "something went wrong please try again" });
  }
}
