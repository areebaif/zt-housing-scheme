import * as React from "react";
import {
  Button,
  NumberInput,
  Box,
  Flex,
  Card,
  Title,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { PaymentType } from "@prisma/client";

export type AddRecurringItemProps = {
  recurringPlanStartDate: Date | null;
  recurringPlanEndDate: Date | null;
  recurringMonth: number | undefined;
  recurringPlanValue: number | undefined;
  onAddSeries: () => void;
  setRecurringMonth: (val: number | undefined) => void;
  setRecurringPlanStartDate: (val: Date | null) => void;
  setRecurringPlanEndDate: (val: Date | null) => void;
  setRecurringPlanValue: (val: number | undefined) => void;
  data: { value: string; label: string }[];
};

export const AddRecurringItemsInput: React.FC<AddRecurringItemProps> = (
  props: AddRecurringItemProps
) => {
  const {
    recurringMonth,
    recurringPlanEndDate,
    recurringPlanStartDate,
    recurringPlanValue,
    setRecurringMonth,
    setRecurringPlanStartDate,
    setRecurringPlanEndDate,
    onAddSeries,
    setRecurringPlanValue,
    data,
  } = props;

  return (
    <Card.Section inheritPadding py="md">
      <Title order={5}>Add Recurring Installment</Title>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <DatePicker
          inputFormat="ddd MMM D YYYY"
          label={"start date"}
          placeholder={"dd/mm/yyyy"}
          value={recurringPlanStartDate}
          onChange={setRecurringPlanStartDate}
        />
        <DatePicker
          inputFormat="ddd MMM D YYYY"
          label={"end date"}
          placeholder={"dd/mm/yyyy"}
          value={recurringPlanEndDate}
          onChange={setRecurringPlanEndDate}
        />
        {/* <Select
          value={PaymentType.installment}
          readOnly
          //onChange={onSetRecurringPaymentType}
          label={"payment type"}
          data={data}
        /> */}
        <NumberInput
          hideControls={true}
          label="recurring month"
          value={recurringMonth}
          placeholder={"enter month value"}
          onChange={(val) => setRecurringMonth(val)}
          parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
          error={
            recurringMonth
              ? recurringMonth < 1 || recurringMonth > 12
                ? "enter values between 1 and 12"
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
        <NumberInput
          hideControls={true}
          label="payment value"
          value={recurringPlanValue}
          placeholder={"value to be collected"}
          onChange={(val) => setRecurringPlanValue(val)}
          parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
          error={
            recurringPlanValue
              ? recurringPlanValue < 1
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
          <Button variant="outline" onClick={onAddSeries}>
            Generate Values
          </Button>
        </Box>
      </Flex>
    </Card.Section>
  );
};
