import * as React from "react";
import { PaymentType } from "@prisma/client";
import { DatePicker } from "@mantine/dates";
import {
  Button,
  NumberInput,
  Box,
  Flex,
  Card,
  Title,
  Select,
} from "@mantine/core";

export type AddIndividualItemInput = {
  paymentPlanDateItem: Date | null;
  setPaymentPlanDateItem: (val: Date | null) => void;
  setPaymentPlanValueItem: (va: number | undefined) => void;
  paymentPlanPaymentType: string | null | undefined;
  onPaymentTypeChange: (val: PaymentType | null) => void;
  data: { value: string; label: string }[];
  paymentPlanValueItem: number | undefined;
  onAddRow: () => void;
};

export const AddIndividualItemInput: React.FC<AddIndividualItemInput> = (
  props: AddIndividualItemInput
) => {
  const {
    paymentPlanDateItem,
    setPaymentPlanDateItem,
    paymentPlanPaymentType,
    onPaymentTypeChange,
    data,
    paymentPlanValueItem,
    setPaymentPlanValueItem,
    onAddRow,
  } = props;
  return (
    <Card.Section inheritPadding py="md">
      <Title order={5}>Add Individual Payment</Title>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <DatePicker
          inputFormat="ddd MMM D YYYY"
          label={"select date"}
          placeholder={"dd/mm/yyyy"}
          //error={!paymentPlanDateItem}
          value={paymentPlanDateItem}
          onChange={setPaymentPlanDateItem}
        />
        <Select
          value={paymentPlanPaymentType}
          onChange={onPaymentTypeChange}
          label={"choose type of payment"}
          placeholder={"pick one"}
          data={data}
        />

        <NumberInput
          hideControls={true}
          label="payment value"
          value={paymentPlanValueItem}
          placeholder={"value to be collected"}
          onChange={(val) => setPaymentPlanValueItem(val)}
          parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
          error={
            paymentPlanValueItem
              ? paymentPlanValueItem < 1
                ? "enter values above 0"
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
        />
        <Box
          sx={(theme) => ({
            paddingTop: theme.spacing.xl,
          })}
        >
          <Button variant="outline" onClick={onAddRow}>
            Add Value
          </Button>
        </Box>
      </Flex>
    </Card.Section>
  );
};
