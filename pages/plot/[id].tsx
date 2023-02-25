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
import { AddPayment } from "@/components/PlotIdPage/AddPaymentForm/AddPayment";
import { PlotUpsertForm } from "@/components/PlotIdPage/PlotUpsertForm/PlotUpsertForm";
import { PlotDetail } from "../api/plot/[id]";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";

const PlotId: React.FC = () => {
  const router = useRouter();
  // const { status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     signIn("google");
  //   },
  // });
  const plotId = router.query?.id as string;
  const [showForm, setShowForm] = React.useState(false);
  const [isEditForm, setIsEditForm] = React.useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = React.useState(false);

  // backend data fetch
  const fetchplot = ReactQuery.useQuery({
    queryKey: ["plotById", plotId],
    queryFn: () => fetchPlotById(plotId),
    enabled: Boolean(plotId), //&& status === "authenticated",
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (fetchplot.isLoading) {
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
    const res: TableRowItem = {
      id: item.id,
      dateParsed: item.payment_date
        ? new Date(item.payment_date).toDateString()
        : "",
      dateISOString: item.payment_date
        ? new Date(item.payment_date).toISOString()
        : "",
      value: item.payment_value ? item.payment_value : undefined,
      paymentType: item.payment_type,
    };
    return res;
  });

  const FormData = {
    plot: plotDetail.plot,
    soldPrice: plotDetail.sale?.sold_price
      ? plotDetail.sale?.sold_price
      : undefined,
    name: plotDetail.customer?.name ? plotDetail.customer?.name : "",
    son_of: plotDetail.customer?.son_of ? plotDetail.customer?.son_of : "",
    cnic: plotDetail.customer?.cnic ? plotDetail.customer?.cnic : "",
    phone: plotDetail.customer?.phone_number
      ? plotDetail.customer?.phone_number
      : "",
    address: plotDetail.customer?.address ? plotDetail.customer?.address : "",
    soldDate: plotDetail.sale?.sold_date
      ? new Date(plotDetail.sale?.sold_date)
      : null,
    futurePaymentPlan: paymentPlanMap?.length ? paymentPlanMap : [],
    isEditForm,
    setIsEditForm,
    setShowForm,
    showForm,
    plotSaleId: plotDetail.sale?.plotSaleId,
  };

  const addPaymentProps = {
    plotNumber: plotDetail.plot,
    customerNumber: plotDetail.customer?.id
      ? plotDetail.customer?.id.toString()
      : "",
    name: plotDetail.customer?.name ? plotDetail.customer?.name : "",
    customerSonOf: plotDetail.customer?.son_of
      ? plotDetail.customer?.son_of
      : "",
    cnic: plotDetail.customer?.cnic ? plotDetail.customer?.cnic : "",
    setShowAddPaymentForm,
    plotSaleId: plotDetail.sale?.plotSaleId,
  };

  return !showForm && !showAddPaymentForm ? (
    <PlotSummary
      plotDetail={plotDetail}
      totalPayment={totalPayment}
      setShowForm={setShowForm}
      setIsEditForm={setIsEditForm}
      setShowAddPaymentForm={setShowAddPaymentForm}
    />
  ) : !showAddPaymentForm ? (
    <PlotUpsertForm {...FormData} />
  ) : (
    <AddPayment {...addPaymentProps} />
  );
};

type PlotSummaryProps = {
  plotDetail: PlotDetail;
  totalPayment: number;
  setShowForm: (val: boolean) => void;
  setIsEditForm: (val: boolean) => void;
  setShowAddPaymentForm: (val: boolean) => void;
};

const PlotSummary: React.FC<PlotSummaryProps> = (props: PlotSummaryProps) => {
  const {
    plotDetail,
    totalPayment,
    setShowForm,
    setIsEditForm,
    setShowAddPaymentForm,
  } = props;
  return (
    <React.Fragment>
      <Grid align={"stretch"}>
        <Grid.Col span={"auto"}>
          <PlotBasicInfo
            plotDetail={plotDetail}
            setShowForm={setShowForm}
            setIsEditForm={setIsEditForm}
          />
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <SellInfo plotDetail={plotDetail} totalPayment={totalPayment} />
        </Grid.Col>
      </Grid>
      {plotDetail.plot[0].plot_status !== "not_sold" ? (
        <React.Fragment>
          <PaymentPlanTable
            tableRows={plotDetail.payment_plan}
            customerName={plotDetail?.customer?.name}
            sonOf={plotDetail?.customer?.son_of}
          />
          <PaymentHistoryTable
            plotDetail={plotDetail}
            tableRows={plotDetail.payment_history}
            setShowAddPaymentForm={setShowAddPaymentForm}
          />
        </React.Fragment>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  );
};

export default PlotId;
