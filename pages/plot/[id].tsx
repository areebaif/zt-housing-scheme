import { useRouter } from "next/router";
import * as ReactQuery from "@tanstack/react-query";

import {
  Checkbox,
  Group,
  Table,
  Grid,
  Text,
  Divider,
  Flex,
  Button,
} from "@mantine/core";
import * as React from "react";
import { fetchPlotById, PlotDetail } from "../../r-query/functions";

const PlotPage = () => {
  const [plotDetail, setPlotDetail] = React.useState<PlotDetail>();
  const router = useRouter();
  const plotId = router.query?.id as string;
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
  const data = fetchplot.data!;
  if (!plotDetail) {
    setPlotDetail(data);
  }
  // formatDate
  let dateString = "";
  if (plotDetail?.plot?.sold_date) {
    const date = new Date(`${plotDetail?.plot.sold_date}`);
    const dateParsed = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date?.getFullYear()}`;
    dateString = dateParsed;
  }

  const paymentRows = plotDetail?.payments?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    const dateParsed = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date?.getFullYear()}`;
    dateString = dateParsed;
    return (
      <tr key={element.id}>
        <td>{element.id}</td>
        <td>{element.description}</td>
        <td>{dateString}</td>
        <td>{element.payment_value}</td>
      </tr>
    );
  });

  return (
    <React.Fragment>
      <Divider my="sm" variant="dashed" />
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Basic Information </Text>
        <Button onClick={() => router.push(`/plot/sale`)}>Add Sale</Button>
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
        <Text>Sell Price: {plotDetail?.plot?.sold_price} </Text>
        <Text>Sell Date: {dateString} </Text>
        <Text>
          Customer Name: {plotDetail?.customer?.name} Son/of:{" "}
          {plotDetail?.customer?.son_of}{" "}
        </Text>
        <Text>Customer cnic: {plotDetail?.customer?.cnic}</Text>
      </Flex>
      <Divider my="sm" variant="dashed" />
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Payment Hostory</Text>
        <Button onClick={() => router.push(`/payment/add`)}>Add Payment</Button>
      </Group>
      <Divider my="sm" variant="dashed" />
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Payment Number</th>
            <th>Description</th>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{paymentRows}</tbody>
      </Table>
    </React.Fragment>
  );
};

export default PlotPage;
