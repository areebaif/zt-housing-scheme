import * as React from "react";
import { useRouter } from "next/router";
import * as ReactQuery from "@tanstack/react-query";
import { Group, Card, Text, Divider, Flex, Button } from "@mantine/core";
import { fetchPlotById } from "../../r-query/functions";
import { PaymentPlanTable, PaymentHistoryTable, PlotBasicInfo, SellInfo } from "@/components";

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
      <PlotBasicInfo plotDetail={plotDetail} plotId={plotId} />
      <SellInfo plotDetail={plotDetail} totalPayment={totalPayment} />
      {plotDetail.plot.status !== "not_sold" ? (
        <React.Fragment>
          <PaymentPlanTable
            tableRows={plotDetail.payment_plan}
            customerName={plotDetail?.customer?.name}
            sonOf={plotDetail?.customer?.son_of}
          />
          <Divider my="sm" variant="dashed" />
          <PaymentHistoryTable plotDetail={plotDetail} plotId={plotId} tableRows={plotDetail.payment_history} />
        </React.Fragment>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default PlotPage;
