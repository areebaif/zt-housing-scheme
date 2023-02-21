import * as React from "react";
import { Plot } from "@prisma/client";

import { Card, Title, Group, Button, TextInput, Table } from "@mantine/core";
import notSoldPlots, {
  NotSoldPlotsSelectFields,
} from "@/pages/api/plot/notSold";
import { AllPlotId } from "../../PlotUpsertForm";
type PlotDetailEditProps = {
  plot: Plot[];
  setIsEditFlag: (val: boolean) => void;
  setAllPlotSale: (val: AllPlotId[]) => void;
  isEditPlotIdDetail: boolean;
  setIsEditPlotIdDetail: (val: boolean) => void;
  setNotSoldPlots: (val: NotSoldPlotsSelectFields[]) => void;
  notSoldPlots: NotSoldPlotsSelectFields[];
  sellPrice: number | undefined;
  setSellPrice: (val: number | undefined) => void;
  // need acess to all plot sale when you are dleteing set allPlotSale to just the first value and sell price equal to its sell price and use has ability to set price
};

export const PlotDetailEditCard: React.FC<PlotDetailEditProps> = (
  props: PlotDetailEditProps
) => {
  const {
    plot,
    setIsEditFlag,
    setAllPlotSale,
    isEditPlotIdDetail,
    notSoldPlots,
    setNotSoldPlots,
    setIsEditPlotIdDetail,
    setSellPrice,
  } = props;
  let totalSalePrice = 0;
  plot.forEach((item) => {
    item.sale_price
      ? (totalSalePrice = totalSalePrice + item.sale_price)
      : (totalSalePrice = totalSalePrice + 0);
  });
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart" mt="3px" mb="0px">
          <Title order={3}>Plot Details</Title>
          <Button
            variant="outline"
            onClick={() => {
              const formattedData = plot.map((item) => {
                return {
                  ...item,
                  value: item.id.toString(),
                  label: item.id.toString(),
                };
              });
              const sortData = [...notSoldPlots, ...formattedData].sort(
                (a, b) => a.id - b.id
              );
              setNotSoldPlots([...sortData]);
              setIsEditFlag(false);
              setSellPrice(undefined);
              setIsEditPlotIdDetail(true);
              setAllPlotSale([]);
            }}
          >
            Delete
          </Button>
        </Group>
      </Card.Section>
      <Card>
        <Card.Section inheritPadding py="md">
          <TextInput
            variant={"unstyled"}
            value={
              "Note: If you want to edit the plot id then delete these plot id's and add all plot id from scratch"
            }
            readOnly={true}
            error={true}
          />
          <Table highlightOnHover fontSize="lg">
            <thead>
              <tr>
                <th>Plot No</th>
                <th>Square ft</th>
                <th>Dimension</th>
                <th>Sale Price</th>
              </tr>
            </thead>
            <tbody>
              {plot.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.square_feet}</td>
                    <td>{item.dimension}</td>
                    <td>
                      {`${item.sale_price}`.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr key={plot.length}>
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
    </Card>
  );
};
