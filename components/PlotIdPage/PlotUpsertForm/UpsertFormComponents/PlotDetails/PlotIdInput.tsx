import * as React from "react";
import { Flex, Button, Box, Select, NumberInput, Table } from "@mantine/core";
import { Plot } from "@prisma/client";
import { AllPlotId } from "../../PlotUpsertForm";
import { NotSoldPlotsSelectFields } from "@/pages/api/housingScheme/[housingSchemeId]/plot";
type PlotIdInput = {
  plot: Plot[];
  allPlotSale: AllPlotId[];
  setAllPlotSale: (val: AllPlotId[]) => void;
  selectPlotIdData: NotSoldPlotsSelectFields[];
  setSelectPlotIdData: (val: NotSoldPlotsSelectFields[]) => void;
  sellPrice: number | undefined;
  setSellPrice: (val: number | undefined) => void;
};

export const PlotIdInput: React.FC<PlotIdInput> = (props: PlotIdInput) => {
  //props
  const {
    allPlotSale,
    setAllPlotSale,
    plot,
    selectPlotIdData,
    sellPrice,
    setSellPrice,
    setSelectPlotIdData,
  } = props;
  // state
  const [individualPlotSalePrice, setIndividualPlotSalePrice] = React.useState<
    number | undefined
  >(undefined);
  const [selectPlotIdVal, setSelectPlotIdVal] = React.useState<string | null>(
    plot[0].id.toString()
  );
  const findPlot = () => {
    const plot = selectPlotIdData?.filter(
      (item) => item.value === selectPlotIdVal
    );
    return plot;
  };
  const handleAddPlot = () => {
    if (!selectPlotIdVal || !individualPlotSalePrice)
      throw new Error("you must enter plot number and sale price");
    const result = findPlot();
    setAllPlotSale([
      ...allPlotSale,
      {
        id: result[0].id,
        squareFeet: result[0].square_feet
          ? result[0].square_feet.toString()
          : "",
        dimension: result[0].dimension ? result[0].dimension : "",
        sellPrice: individualPlotSalePrice,
      },
    ]);
    const parsedSellPrice = sellPrice ? sellPrice : 0;
    const parsedIndividualPlotSalePrice = individualPlotSalePrice
      ? individualPlotSalePrice
      : 0;
    setSellPrice(parsedSellPrice + parsedIndividualPlotSalePrice);

    setSelectPlotIdVal("");
    setIndividualPlotSalePrice(undefined);
    // remove the element fromselect plot id input component
    setSelectPlotIdData(
      selectPlotIdData.filter((item) => item.id !== result[0].id)
    );
  };

  const handleSalePriceChange = (e: number | undefined) => {
    setIndividualPlotSalePrice(e);
  };
  return (
    <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
      <Select
        value={selectPlotIdVal}
        onChange={setSelectPlotIdVal}
        label="plot number"
        placeholder="pick one"
        nothingFound="No options"
        data={selectPlotIdData}
      />
      <NumberInput
        hideControls={true}
        label="sell price"
        value={individualPlotSalePrice}
        placeholder={"enter sold value"}
        withAsterisk
        onChange={(e) => handleSalePriceChange(e)}
        parser={(individualPlotSalePrice) =>
          individualPlotSalePrice?.replace(/\$\s?|(,*)/g, "")
        }
        error={
          individualPlotSalePrice
            ? individualPlotSalePrice < 1
              ? "enter values above 0"
              : false
            : true
        }
        formatter={(value) => {
          return value
            ? !Number.isNaN(parseFloat(value))
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""
            : "";
        }}
      />
      <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
        <Button
          variant="outline"
          onClick={() => {
            handleAddPlot();
          }}
        >
          Add Plot
        </Button>
      </Box>
    </Flex>
  );
};
