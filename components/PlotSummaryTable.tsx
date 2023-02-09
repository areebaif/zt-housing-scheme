import * as React from "react";
import { PlotsSelectFields } from "@/pages/api/plot/add";
import { useRouter } from "next/router";
import {
  Table,
  Title,
  Card,
  Flex,
  Text,
  Grid,
  ScrollArea,
  Box,
  Divider,
} from "@mantine/core";

export interface PlotSaleSummaryTableProps {
  tableHead: string;
  tableRows: PlotsSelectFields[];
}
export const PlotSaleSummaryTable: React.FC<PlotSaleSummaryTableProps> = (
  PlotSaleSummaryTableProps
) => {
  const { tableHead, tableRows } = PlotSaleSummaryTableProps;
  const router = useRouter();

  const rows = tableRows?.map((element) => (
    // <Card
    //   shadow="sm"
    //   p="lg"
    //   radius="md"
    //   withBorder
    //   style={{
    //     overflow: "inherit",
    //     margin: "15px 0 0 0",
    //   }}
    // >
    //   <Card.Section
    //     onClick={() => router.push(`/plot/${element.id}`)}
    //     key={element.id}
    //     inheritPadding
    //     py="md"
    //   >
    <React.Fragment>
      <Divider my="sm" />
      <Grid
        onClick={() => router.push(`/plot/${element.id}`)}
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
        <Grid.Col p="lg" span={4}>
          <Text fz="xl">{element.id}</Text>
        </Grid.Col>

        <Grid.Col p="lg" span={4}>
          <Text fz="xl">{element.square_feet}</Text>
        </Grid.Col>
        <Grid.Col p="lg" span={4}>
          <Text fz="xl">{element.dimension}</Text>
        </Grid.Col>
      </Grid>
    </React.Fragment>
  ));
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ margin: "25px 0 0 0" }}
    >
      <Card.Section p="lg">
        <Grid grow gutter="xl">
          <Grid.Col sx={(theme) => ({ textAlign: "center" })} span={12}>
            <Title order={4}>{tableHead}</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={4}>Plot Number</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={4}>Square ft</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={4}>Dimension</Title>
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
        {rows}
      </Box>
    </Card>
  );
};
