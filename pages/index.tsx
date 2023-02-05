import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Checkbox, Group, Table, Grid, Text, Flex } from "@mantine/core";
import { Plot } from "@prisma/client";
import { fetchAllPlots } from "@/r-query/functions";
import { PlotsSelectFields } from "../pages/api/plot/all";

import { useRouter } from "next/router";

// resuable function. can be used anywhere this value is cached

const AllPlots: React.FC = () => {
  const router = useRouter();

  const fetchPlots = useQuery(["allPlots"], fetchAllPlots, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (fetchPlots.isLoading) {
    // TODO: loading component
    console.log("loading");
    return <span>Loading...</span>;
  }

  if (fetchPlots.isError) {
    return <span>Error: error occured</span>;
  }
  // Set local state data if it does not exist
  const plots = fetchPlots.data;
  console.log("data", plots);
  // table data
  const notSoldPlots = plots?.filter((element) => {
    return element.status === "not_sold";
  });
  const notSoldRowCount = (
    <tr>
      <th>Total</th>
      <th>{notSoldPlots?.length}</th>
      <th></th>
    </tr>
  );
  const notSoldRows = notSoldPlots?.map((element) => (
    <tr onClick={() => router.push(`/plot/${element.id}`)} key={element.id}>
      <td>{element.id}</td>
      <td>{element.square_feet}</td>
      <td>{element.dimension}</td>
    </tr>
  ));
  const soldPlots = plots?.filter((element) => {
    return element.status !== "not_sold";
  });
  const soldRowCount = (
    <tr>
      <th>Total</th>
      <th>{soldPlots?.length}</th>
      <th></th>
    </tr>
  );
  const soldRows = soldPlots?.map((element) => (
    <tr onClick={() => router.push(`/plot/${element.id}`)} key={element.id}>
      <td>{element.id}</td>
      <td>{element.square_feet}</td>
      <td>{element.dimension}</td>
    </tr>
  ));

  return (
    <React.Fragment>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <Text>Total Sold {soldPlots?.length}</Text>
        <Text>Total Not Sold {notSoldPlots?.length}</Text>
      </Flex>
      <Grid>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <Table highlightOnHover>
            <thead>
              <tr>
                <th colSpan={3}>
                  <Text align="center">Sold</Text>
                </th>
              </tr>
              <tr>
                <th>Plot Number</th>
                <th>Square ft</th>
                <th>Dimension</th>
              </tr>
            </thead>
            <tbody>{soldRows}</tbody>
          </Table>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <Table highlightOnHover>
            <thead>
              <tr>
                <th colSpan={3}>
                  <Text align="center">Not Sold</Text>
                </th>
              </tr>
              <tr>
                <th>Plot Number</th>
                <th>Square ft</th>
                <th>Dimension</th>
              </tr>
            </thead>
            <tbody>{notSoldRows}</tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </React.Fragment>
  );
};

export default AllPlots;
