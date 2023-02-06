import * as React from "react";
// Hook Imports
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
// Mantine Imports
import { Grid, Text, Flex } from "@mantine/core";
// Component Imports
import { PlotSaleSummaryTable, TotalsSummary } from "@/components";
// Utilities
import { fetchAllPlots } from "@/r-query/functions";

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
      <TotalsSummary plots={plots} />
      <Grid>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <PlotSaleSummaryTable
            tableHead="Partially Paid"
            tableRows={partiallySold}
          />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <PlotSaleSummaryTable tableHead="Not Sold" tableRows={notSoldPlots} />
        </Grid.Col>
      </Grid>
      <PlotSaleSummaryTable tableHead="Fully Sold" tableRows={fullySold} />
      <PlotSaleSummaryTable
        tableHead="Registry Transferred"
        tableRows={registryTransferred}
      />
    </React.Fragment>
  );
};

export default AllPlots;
