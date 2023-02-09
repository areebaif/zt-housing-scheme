import * as React from "react";
import { useRouter } from "next/router";
import { Text, Group, Button, Loader, Card, Title, Grid } from "@mantine/core";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  UpsertTableRows,
  TableRowItem,
} from "../../../components/TableRowsUpsert";
import { postPlotPayment } from "@/r-query/functions";
import { PaymentInput } from "@/components/PaymentInput";

const AddPayment: React.FC = () => {
  const queryClient = useQueryClient();
  // router
  const router = useRouter();
  const routerReady = router.isReady;
  const query = router.query;
  // plot details
  const [plotId, setPlotId] = React.useState("");
  // customer details
  const [customerId, setCustomerId] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [sonOf, setSonOf] = React.useState("");
  const [customerCNIC, setCustomerCNIC] = React.useState("");
  // table props
  const [tableRows, setTableRows] = React.useState<TableRowItem[]>([]);

  const mutation = useMutation({
    mutationFn: postPlotPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plotById"] });
      router.push(`/plot/${plotId}`);
    },
  });

  const onSubmitForm = () => {
    // data validation
    console.log(tableRows, " I am row");
    if (!tableRows.length) throw new Error(" Please provide data to submit");

    const data = { payment: tableRows, customerId, plotId };
    mutation.mutate(data);
  };

  React.useEffect(() => {
    const plot = query.plotId as string;
    const customerId = query.customerId as string;
    const name = query.customerName as string;
    const sonOf = query.sonOf as string;
    const cnic = query.cnic as string;
    setPlotId(plot);
    setCustomerId(customerId);
    setCustomerCNIC(cnic);
    setCustomerName(name);
    setSonOf(sonOf);
  }, [routerReady]);

  if (mutation.isLoading) {
    return <Loader />;
  }

  if (mutation.isError) {
    return <div>Cannot add payment at this time, please try later</div>;
  }

  return (
    <React.Fragment>
      <PaymentPlotInfo
        plotId={plotId}
        customerName={customerName}
        sonOf={sonOf}
        cnic={customerCNIC}
      />
      <PaymentInput
        tableRows={tableRows}
        setTableRows={setTableRows}
        descriptionField={"Add Payment"}
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
  plotId: string;
  customerName: string;
  sonOf: string;
  cnic: string;
};

const PaymentPlotInfo: React.FC<PaymentPlotInfo> = (props: PaymentPlotInfo) => {
  const { plotId, customerName, sonOf, cnic } = props;
  return (
    <Card shadow="sm" p="xl" radius="md" withBorder style={{ height: "100%" }}>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Basic Information</Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Plot Number</Text> <Text>{plotId} </Text>
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

export default AddPayment;
