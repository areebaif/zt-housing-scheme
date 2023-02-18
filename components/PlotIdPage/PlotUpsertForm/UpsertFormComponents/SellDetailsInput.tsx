import * as React from "react";
import { Card, NumberInput, Flex, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

type SellDetailsInputProps = {
  sellDate: Date | null;
  setSellDate: (val: Date | null) => void;
  sellPrice: number | undefined;
  setSellPrice: (price: number | undefined) => void;

  // developmentChargePercent: number | undefined;
  // setDevelopmentChargePercent: (charges: number | undefined) => void;
};

export const SellDetailsInput: React.FC<SellDetailsInputProps> = (
  props: SellDetailsInputProps
) => {
  const sellPriceRef = React.useRef(null);

  const { sellDate, setSellDate, sellPrice, setSellPrice } = props;

  const onChangeSellPrice = (val: number | undefined) => {
    setSellPrice(val);
  };
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Sell Detail</Title>
      </Card.Section>
      <Card.Section inheritPadding py="md">
        <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
          <DatePicker
            inputFormat="ddd MMM D YYYY"
            label={"select date"}
            placeholder={"dd/mm/yyyy"}
            withAsterisk
            error={!sellDate}
            value={sellDate}
            onChange={setSellDate}
          />
          <NumberInput
            hideControls={true}
            label="sell price"
            value={sellPrice}
            placeholder={"enter sold value"}
            withAsterisk
            onChange={(e) => onChangeSellPrice(e)}
            parser={(sellPrice) => sellPrice?.replace(/\$\s?|(,*)/g, "")}
            error={
              sellPrice
                ? sellPrice < 1
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
        </Flex>
      </Card.Section>
    </Card>
  );
};
