import * as React from "react";
import { useRouter } from "next/router";
import * as ReactQuery from "@tanstack/react-query";
import { Grid, Loader } from "@mantine/core";
import { fetchPlotById } from "../../r-query/functions";
import {
  PaymentPlanTable,
  PaymentHistoryTable,
  PlotBasicInfo,
  SellInfo,
} from "@/components";
import NewPlot from "./sale/[plotId]";
import { PlotDetail } from "../api/plot/[id]";
import { TableRowItem } from "@/components/TableRowsUpsert";

const PlotPage = () => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isEditForm, setIsEditForm] = React.useState(false);
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
    return <Loader />;
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
  const paymentPlanMap = plotDetail.payment_plan?.map((item) => {
    const res = {
      id: item.id,
      dateISOString: item.payment_date
        ? new Date(item.payment_date).toDateString()
        : "",
      value: item.payment_value ? item.payment_value : undefined,
      description: item.description ? item.description : undefined,
    };
    return res;
  });

  const FormData = {
    plotNumber: plotId,
    dimensionString: plotDetail.plot.dimension ? plotDetail.plot.dimension : "",
    squareFt: plotDetail.plot.square_feet
      ? plotDetail.plot.square_feet?.toString()
      : "",
    soldPrice: plotDetail.plot.sold_price
      ? plotDetail.plot.sold_price
      : undefined,
    name: plotDetail.customer?.name ? plotDetail.customer?.name : "",
    son_of: plotDetail.customer?.son_of ? plotDetail.customer?.son_of : "",
    cnic: plotDetail.customer?.cnic ? plotDetail.customer?.cnic : "",
    soldDate: plotDetail.plot.sold_date
      ? new Date(plotDetail.plot.sold_date)
      : null,
    futurePaymentPlan: paymentPlanMap?.length ? paymentPlanMap : [],
    isEditForm,
    setIsEditForm,
  };

  return !showAddForm ? (
    <PlotSummary
      plotDetail={plotDetail}
      plotId={plotId}
      totalPayment={totalPayment}
      setShowAddForm={setShowAddForm}
      setIsEditForm={setIsEditForm}
    />
  ) : (
    <NewPlot {...FormData} />
  );
};

type PlotSummaryProps = {
  plotDetail: PlotDetail;
  plotId: string;
  totalPayment: number;
  setShowAddForm: (val: boolean) => void;
  setIsEditForm: (val: boolean) => void;
};

const PlotSummary: React.FC<PlotSummaryProps> = (props: PlotSummaryProps) => {
  const { plotId, plotDetail, totalPayment, setShowAddForm, setIsEditForm } =
    props;
  return (
    <React.Fragment>
      <Grid align={"stretch"} style={{ margin: "25px 0 0 0" }}>
        <Grid.Col span={"auto"}>
          <PlotBasicInfo
            plotDetail={plotDetail}
            plotId={plotId}
            setShowAddForm={setShowAddForm}
            setIsEditForm={setIsEditForm}
          />
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <SellInfo plotDetail={plotDetail} totalPayment={totalPayment} />
        </Grid.Col>
      </Grid>
      {plotDetail.plot.status !== "not_sold" ? (
        <React.Fragment>
          <PaymentPlanTable
            tableRows={plotDetail.payment_plan}
            customerName={plotDetail?.customer?.name}
            sonOf={plotDetail?.customer?.son_of}
          />

          <PaymentHistoryTable
            plotDetail={plotDetail}
            plotId={plotId}
            tableRows={plotDetail.payment_history}
          />
        </React.Fragment>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default PlotPage;
