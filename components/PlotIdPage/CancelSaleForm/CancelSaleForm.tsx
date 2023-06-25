import * as React from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button, Grid, Group, TransferListData } from "@mantine/core";
import { PaymentRefundTable } from "@/components";
import { PlotBasicInfo, SellInfo } from "@/components";
import { PlotDetail } from "@/pages/api/plot/[id]";
import { cancelSale } from "@/r-query/functions";

type CancelSaleFormProps = {
  plotDetail: PlotDetail;
  totalPayment: number;
  setShowForm: (val: boolean) => void;
  setIsEditForm: (val: boolean) => void;
  setShowCancelSaleForm: (val: boolean) => void;
  showCancelSaleForm: boolean;
};

export const CancelSaleForm: React.FC<CancelSaleFormProps> = (props) => {
  // hooks
  const queryClient = useQueryClient();
  const router = useRouter();

  //props
  const {
    plotDetail,
    totalPayment,
    setShowForm,
    setIsEditForm,
    showCancelSaleForm,
    setShowCancelSaleForm,
  } = props;
  // derived props
  const paymentRefundValues: TransferListData = [[], []];
  plotDetail.payment_history?.map((payment) => {
    paymentRefundValues[0].push({
      value: payment.id.toString(),
      label: `${payment.payment_type} - ${payment.description} - ${new Date(
        payment.payment_date
      ).toDateString()} - ${`${payment.payment_value}`.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      )}`,
    });
  });
  // state
  const [paymentRefundData, setPaymentRefundData] =
    React.useState<TransferListData>(paymentRefundValues);
  // plotDetails.sale.saleId
  // I need sale ID and cancelled payments to sedn to backend

  const mutation = useMutation({
    mutationFn: cancelSale,
    onSuccess: () => {
      queryClient.invalidateQueries();

      //router.push(`/`);
    },
    onError: () => {
      return <div>error occured: Please try again later</div>;
    },
  });

  const onCancelSale = () => {
    const refundPayments = paymentRefundData[1].map((item) => item.value);
    const data = {
      saleId: plotDetail.sale?.plotSaleId!,
      refundPayments: refundPayments,
    };
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <>
      <Grid align={"stretch"}>
        <Grid.Col span={"auto"}>
          <PlotBasicInfo
            plotDetail={plotDetail}
            setShowForm={setShowForm}
            setIsEditForm={setIsEditForm}
            showCancelSaleForm={showCancelSaleForm}
          />
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <SellInfo
            plotDetail={plotDetail}
            totalPayment={totalPayment}
            setShowCancelSaleForm={setShowCancelSaleForm}
            showCancelSaleForm={showCancelSaleForm}
          />
        </Grid.Col>
      </Grid>
      <PaymentRefundTable
        paymentRefundData={paymentRefundData}
        setPaymentRefundData={setPaymentRefundData}
      />
      <Group position="center" style={{ margin: "15px 0 0 0" }}>
        <Button size="lg" onClick={onCancelSale}>
          Submit
        </Button>
      </Group>
    </>
  );
};
