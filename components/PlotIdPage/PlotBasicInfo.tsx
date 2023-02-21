import * as React from "react";
import { Button, Card, Title, Grid, Group, Text } from "@mantine/core";
import { PlotDetail } from "@/pages/api/plot/[id]";

export type PlotBasicInfoProps = {
  plotDetail: PlotDetail;
  setShowForm: (val: boolean) => void;
  setIsEditForm: (val: boolean) => void;
};

export const PlotBasicInfo: React.FC<PlotBasicInfoProps> = (props) => {
  //Props
  const { plotDetail, setShowForm, setIsEditForm } = props;

  const allPlots = plotDetail.plot;

  return (
    <Card shadow="sm" p="xl" radius="md" withBorder style={{ height: "100%" }}>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Title order={3}>Basic Information</Title>
          <Button
            onClick={() => {
              setShowForm(true);
              {
                plotDetail?.plot[0].plot_status === "not_sold"
                  ? setIsEditForm(false)
                  : setIsEditForm(true);
              }
            }}
          >
            {plotDetail?.plot[0].plot_status === "not_sold"
              ? "Add Sale"
              : "Edit Details"}
          </Button>
        </Group>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        {allPlots.map((plot) => {
          return (
            <Grid
              key={plot.id}
              gutter={5}
              gutterXs="md"
              gutterMd="xl"
              gutterXl={50}
            >
              <Grid.Col span={3}>
                <Text weight={"bold"}>Plot Number:</Text>{" "}
                <Text>{plot.id} </Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text weight={"bold"}>Square ft:</Text>{" "}
                <Text>{plot.square_feet} </Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Text weight={"bold"}>Dimension:</Text>{" "}
                <Text>{plot.dimension} </Text>
              </Grid.Col>
            </Grid>
          );
        })}
      </Card.Section>
    </Card>
  );
};
