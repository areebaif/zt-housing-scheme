import * as React from "react";
import { useRouter } from "next/router";
// Hook Imports
import { useQuery } from "@tanstack/react-query";

import { Grid, Loader } from "@mantine/core";
// Component Imports
import { PlotSaleSummaryTable, TotalsSummary } from "@/components";
// Utilities
import { listPlotsByHousingSchemeId } from "@/r-query/functions";

const AllPlots: React.FC = () => {
  const router = useRouter();
  const housingSchemeId = router.query.housingSchemeId;
  const id = housingSchemeId as string;
  const fetchPlots = useQuery(
    ["listPlotsByHousingSchemeId", id],
    () => listPlotsByHousingSchemeId(id),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: id ? true : false,
    }
  );
  if (fetchPlots.isLoading) {
    return <Loader />;
  }

  if (fetchPlots.isError) {
    return <span>Error: error occured</span>;
  }

  const plots = fetchPlots.data;
  // table data
  const notSoldPlots = plots?.filter((element) => {
    return element.plot_status === "not_sold";
  });
  const partiallySold = plots?.filter((element) => {
    return element.plot_status === "partially_paid";
  });

  const fullySold = plots?.filter((element) => {
    return element.plot_status === "fully_paid";
  });

  const registryTransferred = plots?.filter((element) => {
    return element.plot_status === "registry_transferred";
  });

  return (
    <React.Fragment>
      <TotalsSummary plots={plots} />
      <Grid>
        <Grid.Col span={6}>
          <PlotSaleSummaryTable tableHead="Not Sold" tableRows={notSoldPlots} />
        </Grid.Col>
        <Grid.Col span={6}>
          <PlotSaleSummaryTable
            tableHead="Sold - Partial Payment"
            tableRows={partiallySold}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <PlotSaleSummaryTable
            tableHead="Sold - Full Payment"
            tableRows={fullySold}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <PlotSaleSummaryTable
            tableHead="Registry Transferred"
            tableRows={registryTransferred}
          />
        </Grid.Col>
      </Grid>
    </React.Fragment>
  );
};

export default AllPlots;
