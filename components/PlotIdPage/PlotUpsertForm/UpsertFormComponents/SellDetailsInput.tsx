import * as React from "react";
import { Card, NumberInput, Flex, Title, Text, Box } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

type SellDetailsInputProps = {
  sellDate: Date | null;
  setSellDate: (val: Date | null) => void;
  sellPrice: number | undefined;
  setSellPrice: (price: number | undefined) => void;
};

export const SellDetailsInput: React.FC<SellDetailsInputProps> = (
  props: SellDetailsInputProps
) => {
  const { sellDate, setSellDate, sellPrice, setSellPrice } = props;

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
          <Box
            sx={(theme) => ({
              paddingTop: theme.spacing.xs * 0.5,
              paddingLeft: theme.spacing.lg,
            })}
          >
            <Text weight={500} size={"sm"}>
              Total sell price:
            </Text>{" "}
            <Text
              sx={(theme) => ({
                paddingTop: theme.spacing.xs * 0.5,
              })}
            >
              {sellPrice
                ? `${sellPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "0"}{" "}
            </Text>
          </Box>
        </Flex>
      </Card.Section>
    </Card>
  );
};
