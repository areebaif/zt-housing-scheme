import * as React from "react";
import { Table, Text, Title, Card, Grid, Divider } from "@mantine/core";
import { PlotDetail } from "@/pages/api/housingScheme/[housingSchemeId]/plot/[id]";

export type PaymentPlanTable = {
  tableRows?: PlotDetail["payment_plan"];
  customerName?: string;
  sonOf?: string | null;
};

export const PaymentPlanTable: React.FC<PaymentPlanTable> = (
  PaymentPlanTable
) => {
  const { tableRows, customerName, sonOf } = PaymentPlanTable;

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ margin: "25px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Payment Plan</Title>
      </Card.Section>
      <Card.Section sx={(theme) => ({ padding: "10px 20px 20px 20px " })}>
        <Grid grow gutter="xl">
          <Grid.Col span={1}>
            <Title order={4}>Sr no</Title>
          </Grid.Col>
          <Grid.Col span={2}>
            <Title order={4}>Payment Type</Title>
          </Grid.Col>
          <Grid.Col span={3}>
            <Title order={4}>Date</Title>
          </Grid.Col>
          <Grid.Col span={2}>
            <Title order={4}>Status</Title>
          </Grid.Col>
          <Grid.Col span={2}>
            <Title order={4}>Value</Title>
          </Grid.Col>
        </Grid>
        {tableRows?.map((element, index) => {
          const date = new Date(`${element.payment_date}`);
          return (
            <React.Fragment key={index}>
              <Divider my="sm" />
              <Grid
                sx={(theme) => ({
                  backgroundColor:
                    element.status === "paid"
                      ? theme.colors.green[0]
                      : element.status === "partially paid"
                      ? theme.colors.yellow[0]
                      : "white",
                  // "&:hover": {
                  //   backgroundColor:
                  //     theme.colorScheme === "dark"
                  //       ? theme.colors.dark[5]
                  //       : theme.colors.gray[1],
                  //   cursor: "pointer",
                  // },
                })}
                grow
                gutter="xl"
              >
                <Grid.Col span={1}>
                  <Text fz="xl">{index + 1}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text fz="xl">{element.payment_type}</Text>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Text fz="xl">{date.toDateString()}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text fz="xl">{element.status}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text fz="xl">
                    {`${element.payment_value}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
              </Grid>
            </React.Fragment>
          );
        })}
        {tableRows?.length ? <TotalGrid tableRows={tableRows} /> : undefined}
      </Card.Section>
    </Card>
  );
};

type TotalGrid = {
  tableRows: PlotDetail["payment_plan"];
};

const TotalGrid: React.FC<TotalGrid> = (props: TotalGrid) => {
  const { tableRows } = props;
  let total = 0;

  tableRows?.forEach((item) => {
    item.payment_value
      ? (total = total + item.payment_value)
      : (total = total + 0);
  });

  return (
    <React.Fragment>
      <Divider my="sm" />
      <Grid
        sx={(theme) => ({
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[1],
            cursor: "pointer",
          },
        })}
        grow
        gutter="xl"
      >
        <Grid.Col span={1}>
          <Text fz="xl">Total</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text fz="xl">{}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Text fz="xl">{}</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text fz="xl">{}</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text fz="xl">
            {`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        </Grid.Col>
      </Grid>
    </React.Fragment>
  );
};
