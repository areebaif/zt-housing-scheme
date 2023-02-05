import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Table, Grid, Text, Flex } from "@mantine/core";
import { useRouter } from "next/router";
import { Plot, Status } from "@prisma/client";

import { fetchAllPlots } from "@/r-query/functions";
import { PlotsSelectFields } from "./api/plot/add";

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

  const plots = fetchPlots.data;
  // table data
  const notSoldPlots = plots?.filter((element) => {
    return element.status === "not_sold";
  });
  const partiallySold = plots?.filter((element) => {
    return element.status === "partially_paid";
  });

  const fullySold = plots?.filter((element) => {
    return element.status === "fully_paid";
  });

  const registryTransferred = plots?.filter((element) => {
    return element.status === "registry_transferred";
  });

  return (
    <React.Fragment>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <Text>Total Partially Sold {partiallySold?.length}</Text>
        <Text>Total Not Sold {notSoldPlots?.length}</Text>
        <Text>Total fully Sold {fullySold?.length}</Text>
        <Text>Registry Transferred {registryTransferred?.length}</Text>
      </Flex>
      <Grid>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <PlotSaleSummaryTable
            tableHead="partially paid"
            tableRows={partiallySold}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <PlotSaleSummaryTable tableHead="not sold" tableRows={notSoldPlots} />
        </Grid.Col>
      </Grid>
      <PlotSaleSummaryTable tableHead="fully sold" tableRows={fullySold} />
      <PlotSaleSummaryTable
        tableHead="registry trasnferred"
        tableRows={registryTransferred}
      />
    </React.Fragment>
  );
};

export interface PlotSaleSummaryTableProps {
  tableHead: string;
  tableRows: PlotsSelectFields[];
}
const PlotSaleSummaryTable: React.FC<PlotSaleSummaryTableProps> = (
  PlotSaleSummaryTableProps
) => {
  const { tableHead, tableRows } = PlotSaleSummaryTableProps;
  const router = useRouter();

  const rows = tableRows?.map((element) => (
    <tr onClick={() => router.push(`/plot/${element.id}`)} key={element.id}>
      <td>{element.id}</td>
      <td>{element.square_feet}</td>
      <td>{element.dimension}</td>
    </tr>
  ));
  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th colSpan={3}>
            <Text align="center">{tableHead}</Text>
          </th>
        </tr>
        <tr>
          <th>Plot Number</th>
          <th>Square ft</th>
          <th>Dimension</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default AllPlots;
