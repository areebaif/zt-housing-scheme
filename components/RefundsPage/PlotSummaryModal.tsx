import { Card, Grid, Title, Divider, Text } from "@mantine/core";
import { refundPlotData } from "@/pages/api/plot/refundSummary";

type modalPlotSummaryProps = {
  plotId: string;
  name: string;
  sonOf: string;
  salePrice: number;
  saleDate: string;
  payments: refundPlotData["payments"];
};
// plot number, name, son of, sale price, saledate
// Payments

export const PlotSummaryModal: React.FC<modalPlotSummaryProps> = ({
  plotId,
  name,
  sonOf,
  salePrice,
  saleDate,
  payments,
}) => {
  const refundedPayments = payments.filter(
    (payment) => payment.payment_status === "refund"
  );

  return (
    <>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{ margin: "25px 0 0 0" }}
      >
        <Grid>
          <Grid.Col sx={(theme) => ({ textAlign: "center" })} span={12}>
            <Title order={5}>Plot Information</Title>
          </Grid.Col>
        </Grid>
        <Card.Section withBorder inheritPadding py="xs">
          <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Plot Number:</Text> <Text>{plotId} </Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Name</Text> <Text>{name} </Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Son of</Text> <Text>{sonOf} </Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Sale Price</Text>{" "}
              <Text>
                {`${salePrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              </Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Sale Date</Text>{" "}
              <Text>{new Date(saleDate).toDateString()} </Text>
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{ margin: "25px 0 0 0" }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Grid>
            <Grid.Col sx={(theme) => ({ textAlign: "center" })} span={12}>
              <Title order={5}>Refunded Payments</Title>
            </Grid.Col>
          </Grid>
        </Card.Section>
        <Card.Section sx={(theme) => ({ padding: "10px 20px 0 20px " })}>
          <Grid grow gutter="xl">
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Sr No</Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Payment Type</Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Description</Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Date</Text>
            </Grid.Col>
            <Grid.Col span={"auto"}>
              <Text weight={"bold"}>Value</Text>{" "}
            </Grid.Col>
          </Grid>
          {refundedPayments.map((payment, index) => (
            <>
              <Divider my="sm" />
              <Grid
                key={index}
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
                <Grid.Col span={"auto"}>
                  <Text>{index + 1}</Text>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Text>{payment.payment_type}</Text>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Text>{payment.description}</Text>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Text>{new Date(payment.payment_date).toDateString()}</Text>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Text>
                    {`${payment.payment_value}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}{" "}
                  </Text>
                </Grid.Col>
              </Grid>
            </>
          ))}
        </Card.Section>
      </Card>
    </>
  );
};
