import * as ReactQuery from "@tanstack/react-query";
import * as React from "react";
import { Checkbox, Group, Table, Grid, Text } from "@mantine/core";
import { fetchAllPlots } from "@/r-query/functions";
import { Status } from "@prisma/client";
import Link from "next/link";

// resuable function. can be used anywhere this value is cached

const AllPlots = () => {
  const [isNotSold, setIsNotSold] = React.useState(false);
  const [isSold, setIsSold] = React.useState(false);

  const plots = ReactQuery.useQuery(["allPlots"], fetchAllPlots, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  // table data

  const notSoldPlots = plots.data?.filter((element) => {
    return element.status === "not_sold";
  });
  const countRowNotSold = (
    <tr>
      <th>Total</th>
      <th>{notSoldPlots?.length}</th>
      <th></th>
    </tr>
  );
  const soldPlots = plots.data?.filter((element) => {
    return element.status !== "not_sold";
  });
  const countRowSold = (
    <tr>
      <th>Total</th>
      <th>{soldPlots?.length}</th>
      <th></th>
    </tr>
  );
  const soldRows = soldPlots?.map((element) => (
    <tr key={element.id}>
      <td>{element.id}</td>
      <td>{element.square_feet}</td>
      <td>{element.dimension}</td>
    </tr>
  ));
  const notSoldRows = notSoldPlots?.map((element) => (
    <tr key={element.id}>
      <td>{element.id}</td>
      <td>{element.square_feet}</td>
      <td>{element.dimension}</td>
    </tr>
  ));

  return (
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
              <th>Plot Id</th>
              <th>Square feet</th>
              <th>Dimension</th>
            </tr>
          </thead>
          <tbody>{soldRows}</tbody>
          <tfoot>{countRowSold}</tfoot>
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
              <th>Plot Id</th>
              <th>Square feet</th>
              <th>Dimension</th>
            </tr>
          </thead>
          <tbody>{notSoldRows}</tbody>
          <tfoot>{countRowNotSold}</tfoot>
        </Table>
      </Grid.Col>
    </Grid>
  );
};

export default AllPlots;
