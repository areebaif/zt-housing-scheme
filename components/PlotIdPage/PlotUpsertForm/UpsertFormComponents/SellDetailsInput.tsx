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
  const {
    sellDate,
    setSellDate,
    sellPrice,
    setSellPrice,

    // developmentChargePercent,
    // setDevelopmentChargePercent,
  } = props;
  // const onChangeDevelopmentCharge = (val: number | undefined) => {
  //   setDevelopmentChargePercent(val);
  //   // setDevelopmentCharges(val && sellPrice ? (val / 100) * sellPrice : 0);
  // };
  const onChangeSellPrice = (val: number | undefined) => {
    setSellPrice(val);
    // setDevelopmentCharges(
    //   val && developmentChargePercent
    //     ? (developmentChargePercent / 100) * val
    //     : 0
    // );
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
            label="sell price"
            value={sellPrice}
            placeholder={"enter sold value"}
            withAsterisk
            onChange={(val) => onChangeSellPrice(val)}
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
          {/* <NumberInput
            label="down payment"
            value={downPayment}
            placeholder={"enter down payment"}
            withAsterisk
            onChange={(val) => setDownPayment(val)}
            parser={(downPayment) => downPayment?.replace(/\$\s?|(,*)/g, "")}
            error={
              downPayment
                ? downPayment < 1
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
          /> */}
          {/* <NumberInput
            label="development charges (% of sell price)"
            value={developmentChargePercent}
            placeholder={"enter value between 0 and 100"}
            onChange={(val) => onChangeDevelopmentCharge(val)}
            parser={(developmentCharges) =>
              developmentCharges?.replace(/\$\s?|(,*)/g, "")
            }
            error={
              developmentChargePercent
                ? developmentChargePercent < 0 || developmentChargePercent > 100
                  ? "enter values between 0 and 100"
                  : false
                : false
            }
            formatter={(value) => {
              return value
                ? !Number.isNaN(parseFloat(value))
                  ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : ""
                : "";
            }}
          /> */}
          {/* <NumberInput
            label="development charges (pkr)"
            value={developmentCharges}
            placeholder={
              developmentCharges === 0 ? "enter sell price and % for value" : ""
            }
            disabled={true}
            parser={(developmentCharges) =>
              developmentCharges?.replace(/\$\s?|(,*)/g, "")
            }
            formatter={(value) => {
              return value
                ? !Number.isNaN(parseFloat(value))
                  ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : ""
                : "";
            }}
          /> */}
        </Flex>
      </Card.Section>
    </Card>
  );
};
