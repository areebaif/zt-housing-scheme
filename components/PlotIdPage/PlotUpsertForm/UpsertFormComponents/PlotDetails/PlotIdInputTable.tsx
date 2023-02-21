import * as React from "react";
import { Plot } from "@prisma/client";
import { Card, Flex, Title, Group, Text, Button, Table } from "@mantine/core";
import { AllPlotId } from "../../PlotUpsertForm";
import { NotSoldPlotsSelectFields } from "@/pages/api/plot/notSold";
import { PlotIdInput } from "./PlotIdInput";

type PlotIdInputTableProps = {
  plot: Plot[];
  allPlotSale: AllPlotId[];
  setAllPlotSale: (val: AllPlotId[]) => void;
  notSoldPlots: NotSoldPlotsSelectFields[];
};

export const PlotIdInputTable: React.FC<PlotIdInputTableProps> = (
  props: PlotIdInputTableProps
) => {
  const { notSoldPlots, allPlotSale, setAllPlotSale, plot } = props;
  const [selectPlotIdData, setSelectPlotIdData] = React.useState(notSoldPlots);

  const handleDeletePlot = (id: number) => {
    setAllPlotSale(allPlotSale.filter((item) => item.id !== id));
    // add that element back to select plot id input component
    const result = notSoldPlots.filter((item) => item.id === id);
    const sortData = [...selectPlotIdData, ...result].sort(
      (a, b) => a.id - b.id
    );
    setSelectPlotIdData([...sortData]);
  };
  const inputPlotIdData = {
    setAllPlotSale,
    notSoldPlots,
    allPlotSale,
    plot,
    selectPlotIdData,
    setSelectPlotIdData,
  };
  let totalSalePrice = 0;
  allPlotSale.forEach((item) => {
    item.sellPrice
      ? (totalSalePrice = totalSalePrice + item.sellPrice)
      : (totalSalePrice = totalSalePrice + 0);
  });
  return (
    <>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          overflow: "inherit",
          margin: "15px 0 0 0",
        }}
        sx={(theme) => ({ backgroundColor: theme.colors.gray[1] })}
      >
        <Card.Section inheritPadding py="md">
          <PlotIdInput {...inputPlotIdData} />
        </Card.Section>
      </Card>
      {allPlotSale.length ? (
        <Card>
          <Card.Section inheritPadding py="md">
            <Table
              sx={(theme) => ({ paddingBottom: "0px" })}
              fontSize={"lg"}
              highlightOnHover
            >
              <thead>
                <tr>
                  <th>Plot No</th>
                  <th>Square ft</th>
                  <th>Dimension</th>
                  <th>Sale Price</th>
                  <th>Delete Plot</th>
                </tr>
              </thead>
              <tbody>
                {allPlotSale.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.squareFeet}</td>
                      <td>{item.dimension}</td>
                      <td>
                        {`${item.sellPrice}`.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
                      </td>
                      <td>
                        {" "}
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleDeletePlot(item.id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                <tr key={allPlotSale.length}>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td>
                    {`${totalSalePrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Section>
        </Card>
      ) : undefined}
    </>
  );
};
