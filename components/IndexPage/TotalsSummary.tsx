import * as React from "react";
import { Grid, Text, Card, Title, Badge } from "@mantine/core";
// Type Imports
import { PlotsSelectFields } from "@/pages/api/plot/all";

type TotalsSummaryProps = {
  plots: PlotsSelectFields[];
};

export const TotalsSummary: React.FC<TotalsSummaryProps> = (props) => {
  const { plots } = props;
  // Derived from Plots data from Props
  const notSoldPlots = plots?.filter(
    (element) => element.status === "not_sold"
  );
  const partiallySold = plots?.filter(
    (element) => element.status === "partially_paid"
  );
  const fullySold = plots?.filter((element) => element.status === "fully_paid");
  const registryTransferred = plots?.filter(
    (element) => element.status === "registry_transferred"
  );
  // Render
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Sale Totals Summary</Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Sold - Partial Payment</Text>{" "}
            <Badge size="xl" color="green" variant="light">
              {partiallySold?.length}
            </Badge>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Sold - Full Payment </Text>{" "}
            <Badge size="xl" color="green" variant="light">
              {fullySold?.length}
            </Badge>
          </Grid.Col>
          <Grid.Col span={3}>
            <Text weight={"bold"}>Not Sold</Text>{" "}
            <Badge size="xl" color="green" variant="light">
              {notSoldPlots?.length}
            </Badge>
          </Grid.Col>

          <Grid.Col span={3}>
            <Text weight={"bold"}>Registry Transferred</Text>{" "}
            <Badge size="xl" color="green" variant="light">
              {registryTransferred?.length}
            </Badge>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
};
