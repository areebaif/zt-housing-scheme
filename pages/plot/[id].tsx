import { useRouter } from "next/router";
import * as ReactQuery from "@tanstack/react-query";
import { Group, Table, Text, Divider, Flex, Button } from "@mantine/core";
import * as React from "react";
import { fetchPlotById } from "../../r-query/functions";
import { Payments, Payment_Plan } from "@prisma/client";

const PlotPage = () => {
  const router = useRouter();
  const plotId = router.query?.id as string;

  // backend data fetch
  const fetchplot = ReactQuery.useQuery({
    queryKey: ["plotById", plotId],
    queryFn: () => fetchPlotById(plotId),
    enabled: Boolean(plotId),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (fetchplot.isLoading) {
    // TODO: loading component
    console.log("loading");
    return <span>Loading...</span>;
  }

  if (fetchplot.isError) {
    return <span>Error: error occured</span>;
  }
  // Set local state data if it does not exist
  const plotDetail = fetchplot.data;

  // we will calculate total payment from payment History
  let totalPayment: number = 0;
  plotDetail?.payment_history?.forEach((item) => {
    totalPayment = totalPayment + item.payment_value;
  });

  return (
    <React.Fragment>
      <Divider my="sm" variant="dashed" />
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Basic Information </Text>
        <Button
          onClick={() =>
            router.push(
              `/plot/sale/${plotId}?dimension=${plotDetail?.plot?.dimension}&squareFeet=${plotDetail?.plot?.square_feet}`
            )
          }
        >
          {plotDetail?.plot.status === "not_sold" ? "Add Sale" : "Edit Details"}
        </Button>
      </Group>
      <Divider my="sm" variant="dashed" />
      <Flex direction="column" align="flex-start" gap="md" justify="flex-start">
        <Text>Plot Number: {plotDetail?.plot?.id} </Text>
        <Text>Square ft: {plotDetail?.plot?.square_feet} </Text>
        <Text>Dimension: {plotDetail?.plot?.dimension} </Text>
      </Flex>
      <Divider my="sm" variant="dashed" />
      <Text weight={500}>Sell Information </Text>
      <Divider my="sm" variant="dashed" />
      <Flex direction="column" align="flex-start" gap="md" justify="flex-start">
        <Text>
          Sell Price:{" "}
          {`${plotDetail?.plot?.sold_price}`.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          )}{" "}
        </Text>
        <Text>
          Sell Date: {new Date(`${plotDetail?.plot.sold_date}`).toDateString()}{" "}
        </Text>
        <Text>
          Total Payment Recieved:{" "}
          {`${totalPayment}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
        </Text>
        <Text>
          Customer Name: {plotDetail?.customer?.name} Son/of:{" "}
          {plotDetail?.customer?.son_of}{" "}
        </Text>
        <Text>Customer cnic: {plotDetail?.customer?.cnic}</Text>
      </Flex>
      {plotDetail.plot.status !== "not_sold" ? (
        <React.Fragment>
          <Divider my="sm" variant="dashed" />
          <Text weight={500}>Payment Plan</Text>
          <Divider my="sm" variant="dashed" />
          <PaymentPlanTable
            tableRows={plotDetail.payment_plan}
            customerName={plotDetail?.customer?.name}
            sonOf={plotDetail?.customer?.son_of}
          />
          <Divider my="sm" variant="dashed" />
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Payment History</Text>
            <Button
              onClick={() =>
                router.push(
                  `/payment/add/${plotId}?customerId=${plotDetail?.customer?.id}&customerName=${plotDetail?.customer?.name}&sonOf=${plotDetail?.customer?.son_of}&cnic=${plotDetail?.customer?.cnic}`
                )
              }
            >
              Add Payment
            </Button>
          </Group>
          <Divider my="sm" variant="dashed" />
          <PaymentHistoryTable tableRows={plotDetail.payment_history} />
        </React.Fragment>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default PlotPage;

export interface PaymentPlanTable {
  tableRows?: Payment_Plan[];
  customerName?: string;
  sonOf?: string | null;
}

export interface PaymentHistoryTable {
  tableRows?: Payments[];
}

export const PaymentPlanTable: React.FC<PaymentPlanTable> = (
  PaymentPlanTable
) => {
  const { tableRows, customerName, sonOf } = PaymentPlanTable;
  const paymentPlanRows = tableRows?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    return (
      <tr key={element.id}>
        <td>{element.plot_id}</td>
        <td>{customerName}</td>
        <td>{sonOf}</td>
        <td>{date.toDateString()}</td>
        <td>
          {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
      </tr>
    );
  });

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Plot Number</th>
          <th>Customer Name</th>
          <th>Son/ of</th>
          <th>Estimated Payment Date</th>
          <th>Estimated Payment Value</th>
        </tr>
      </thead>
      <tbody>{paymentPlanRows}</tbody>
    </Table>
  );
};

export const PaymentHistoryTable: React.FC<PaymentHistoryTable> = (
  PaymentHistoryTable
) => {
  const { tableRows } = PaymentHistoryTable;
  const paymentHistoryRows = tableRows?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    return (
      <tr key={element.id}>
        <td>{element.id}</td>
        <td>{element.description}</td>
        <td>{date.toDateString()}</td>
        <td>
          {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
      </tr>
    );
  });

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Payment Number</th>
          <th>Description</th>
          <th>Date</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>{paymentHistoryRows}</tbody>
    </Table>
  );
};
