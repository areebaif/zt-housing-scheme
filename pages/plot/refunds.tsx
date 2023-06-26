import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchRefundSummary } from "@/r-query/functions";
import { Loader, Card, Grid, Title, Box, Divider, Text } from "@mantine/core";
import { PaymentType, PaymentStatus } from "@prisma/client";

export const RefundSummary: React.FC = () => {
  const { data: session, status } = useSession({
    required: true,
  });

  const fetchRefundStatus = useQuery(["refundSummary"], fetchRefundSummary, {
    enabled: status === "authenticated",
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (fetchRefundStatus.isLoading) {
    return <Loader />;
  }

  if (fetchRefundStatus.isError) {
    return <span>Error: error occured</span>;
  }
  const refundSummary = fetchRefundStatus.data.data;
  console.log(refundSummary, "holla");

  return (
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
            <Title order={3}>Refund Summary</Title>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Card.Section sx={(theme) => ({ padding: "10px 20px 0 20px " })}>
        <Grid grow gutter="xl">
          <Grid.Col span={"auto"}>
            <Title order={4}>Plot Number</Title>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={4}>Name</Title>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={4}>Son of</Title>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={4}>Sale Price</Title>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={4}>Sale Date</Title>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Title order={4}>Refund/ Total Payments</Title>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Box
        sx={(theme) => ({
          maxHeight: 500,
          overflowY: "auto",
          overflowX: "hidden",
        })}
      >
        {refundSummary.map((element, index) => {
          const total = element.payments.length;
          let refundedPayments = 0;
          element.payments.forEach((payment) => {
            if (payment.payment_status === "refund") refundedPayments++;
          });

          return (
            <React.Fragment key={index}>
              <Divider my="sm" />
              <Grid
                //onClick={() => router.push(`/plot/${element.id}`)}
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
                <Grid.Col
                  //sx={(theme) => ({ paddingLeft: theme.spacing.sm })}
                  span={"auto"}
                >
                  <Text fz="xl">{element.sale.plotId}</Text>
                </Grid.Col>
                <Grid.Col
                  //sx={(theme) => ({ paddingLeft: theme.spacing.lg })}
                  span={"auto"}
                >
                  <Text fz="xl">{element.customer.name}</Text>
                </Grid.Col>
                <Grid.Col
                  // sx={(theme) => ({ paddingLeft: theme.spacing.xl })}
                  span={"auto"}
                >
                  <Text fz="xl">{element.customer.son_of}</Text>
                </Grid.Col>
                <Grid.Col
                  sx={(theme) => ({ paddingLeft: theme.spacing.xl })}
                  span={"auto"}
                >
                  <Text fz="xl">
                    {`${element.sale.sale_price}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </Text>
                </Grid.Col>
                <Grid.Col
                  // sx={(theme) => ({ paddingLeft: theme.spacing.xl })}
                  span={"auto"}
                >
                  <Text fz="xl">
                    {new Date(element.sale.sold_date).toDateString()}
                  </Text>
                </Grid.Col>
                <Grid.Col span={"auto"}>
                  <Text
                    sx={(theme) => ({ paddingLeft: theme.spacing.xl })}
                    fz="xl"
                  >{`${total}/${refundedPayments}`}</Text>
                </Grid.Col>
              </Grid>
            </React.Fragment>
          );
        })}
      </Box>
    </Card>
  );
};

export default RefundSummary;
