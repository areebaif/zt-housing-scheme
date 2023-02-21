import * as React from "react";
import { useRouter } from "next/router";
import { Plot } from "@prisma/client";
import { Text, Group, Button, Loader, Card, Title, Grid } from "@mantine/core";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { TableRowItem } from "./PaymentInputTable";
import { postPlotPayment } from "@/r-query/functions";
import { PaymentInput } from "@/components/PlotIdPage/AddPaymentForm/PaymentInput";

type AddPayment = {
  plotNumber: Plot[];
  customerNumber: string;
  name: string;
  customerSonOf: string;
  cnic: string;
  setShowAddPaymentForm: (val: boolean) => void;
  plotSaleId: number | undefined;
};

export const AddPayment: React.FC<AddPayment> = (props: AddPayment) => {
  const {
    plotNumber,
    customerSonOf,
    name,
    cnic,
    setShowAddPaymentForm,
    plotSaleId,
  } = props;
  const queryClient = useQueryClient();
  // router
  const router = useRouter();

  // table props
  const [tableRows, setTableRows] = React.useState<TableRowItem[]>([]);

  const mutation = useMutation({
    mutationFn: postPlotPayment,
    onSuccess: () => {
      queryClient.invalidateQueries();
      // setPayment form false
      setShowAddPaymentForm(false);
      router.push(`/plot/${plotNumber[0].id}`);
    },
  });

  const onSubmitForm = () => {
    // data validation
    if (!tableRows.length) throw new Error(" Please provide data to submit");

    const data = {
      payment: tableRows,
      saleId: plotSaleId!,
    };

    mutation.mutate(data);
  };

  if (mutation.isLoading) {
    return <Loader />;
  }

  if (mutation.isError) {
    return <div>Cannot add payment at this time, please try later</div>;
  }

  return (
    <React.Fragment>
      <PaymentPlotInfo
        plotId={plotNumber}
        customerName={name}
        sonOf={customerSonOf}
        cnic={cnic}
      />
      <PaymentInput
        tableRows={tableRows}
        setTableRows={setTableRows}
        title={"Add Payment"}
        showDescriptionField={true}
      />
      <Group position="center" style={{ margin: "15px 0 0 0" }}>
        <Button size="lg" onClick={onSubmitForm}>
          Submit
        </Button>
      </Group>
    </React.Fragment>
  );
};

export type PaymentPlotInfo = {
  plotId: Plot[];
  customerName: string;
  sonOf: string;
  cnic: string;
};

const PaymentPlotInfo: React.FC<PaymentPlotInfo> = (props: PaymentPlotInfo) => {
  const { plotId, customerName, sonOf, cnic } = props;
  const plotIds = plotId.map((plot) => plot.id);
  const plotIdString = plotIds.toString();

  return (
    <Card shadow="sm" p="xl" radius="md" withBorder style={{ height: "100%" }}>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Basic Information</Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Plot Number</Text>{" "}
            <Text>{plotIdString} </Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Customer Name</Text>{" "}
            <Text>{customerName} </Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Son of</Text> <Text>{sonOf} </Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text weight={"bold"}>CNIC no</Text> <Text>{cnic} </Text>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};
