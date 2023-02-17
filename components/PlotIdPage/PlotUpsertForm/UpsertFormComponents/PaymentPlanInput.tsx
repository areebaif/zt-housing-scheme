import * as React from "react";
import {
  Button,
  Table,
  NumberInput,
  Box,
  Flex,
  Card,
  Title,
  Select,
} from "@mantine/core";

import { addMonth, formatAddTime } from "@/utilities";
import { DatePicker } from "@mantine/dates";
import { PaymentType } from "@prisma/client";

// export enum TypePayment {
//   down_payment = "down_payment",
//   development_charge = "development_charge",
//   installment = "installment",
//   other = "other",
// }

export interface TableRowItem {
  id: number;
  dateParsed: string;
  dateISOString: string;
  value: number | undefined;
  description?: string;
  paymentType: PaymentType;
}
export interface UpsertTableRowsProps {
  //tableHeader: string;
  tableRows: TableRowItem[];
  setTableRows: (data: TableRowItem[]) => void;
}

export const PaymentPlanTableRows: React.FC<UpsertTableRowsProps> = (
  UpsertTableRowsProps
) => {
  // props
  const { tableRows, setTableRows } = UpsertTableRowsProps;
  const [description, setDescription] = React.useState("");
  // individual row adding props
  const [paymentPlanDateItem, setPaymentPlanDateItem] =
    React.useState<Date | null>(null);
  const [paymentPlanValueItem, setPaymentPlanValueItem] = React.useState<
    number | undefined
  >(undefined);
  const [paymentPlanPaymentType, setPaymentPlanPaymentType] =
    React.useState<PaymentType | null>();
  // series row adding props
  const [recurringPlanStartDate, setRecurringPlanStartDate] =
    React.useState<Date | null>(null);
  const [recurringPlanEndDate, setRecurringPlanEndDate] =
    React.useState<Date | null>(null);
  const [recurringPlanValue, setRecurringPlanValue] = React.useState<
    number | undefined
  >(undefined);
  const [recurringPlanPaymentType, setRecurringPlanPaymentType] =
    React.useState<PaymentType>(PaymentType.installment);
  const [recurringMonth, setRecurringMonth] = React.useState<
    number | undefined
  >(undefined);
  const [deleteStartIndex, setDeleteStartIndex] = React.useState<
    number | undefined
  >(undefined);
  const [deleteEndIndex, setDeleteEndIndex] = React.useState<
    number | undefined
  >(undefined);

  const data = [
    {
      value: PaymentType.down_payment,
      label: "down payment",
    },
    {
      value: PaymentType.development_charge,
      label: "development charge",
    },
    { value: PaymentType.installment, label: "installment" },
    { value: PaymentType.other, label: "other" },
  ];

  const onPaymentTypeChange = (val: PaymentType | null) => {
    setPaymentPlanPaymentType(val);
  };

  const onAddSeries = () => {
    const startDateISO = formatAddTime(`${recurringPlanStartDate}`);
    let recurringMonthVal = startDateISO;
    const endDateISO = formatAddTime(`${recurringPlanEndDate}`);

    setDeleteStartIndex(tableRows?.length ? tableRows?.length : 0);

    let addRows = [];
    while (recurringMonthVal < endDateISO) {
      const key: number = tableRows?.length ? tableRows?.length : 0;
      recurringMonthVal = addMonth(recurringMonthVal, recurringMonth!);
      const obj = {
        id: key,
        value: recurringPlanValue,

        dateParsed: recurringMonthVal,
        dateISOString: recurringMonthVal,
        paymentType: recurringPlanPaymentType
          ? recurringPlanPaymentType
          : PaymentType.other,
      };
      addRows.push(obj);
    }
    setTableRows([...tableRows, ...addRows]);
    setDeleteEndIndex(tableRows?.length + addRows.length - 1);
    setRecurringPlanEndDate(null);
    setRecurringPlanStartDate(null);
    setRecurringPlanValue(undefined);
    setRecurringMonth(undefined);
  };
  const onSeriesDelete = (startIndex: number, endIndex: number) => {
    if (startIndex === 0) {
      const result = tableRows.slice(endIndex + 1, tableRows.length);
      setTableRows([...result]);
      setDeleteEndIndex(undefined);
      setDeleteStartIndex(undefined);
    } else {
      const start = tableRows.slice(0, startIndex);
      const end = tableRows.slice(endIndex + 1, tableRows.length);
      setTableRows([...start, ...end]);
      setDeleteEndIndex(undefined);
      setDeleteStartIndex(undefined);
    }
  };
  const onAddRow = () => {
    // do some validation here aswell
    console.log(deleteEndIndex, deleteEndIndex, "miztt");
    if (
      !paymentPlanDateItem ||
      !paymentPlanValueItem ||
      !paymentPlanPaymentType
    ) {
      throw new Error("please enter date,value and payment type to add a row");
    }

    const key = tableRows?.length ? tableRows?.length : 0;

    const dateISO = formatAddTime(`${paymentPlanDateItem}`);

    setTableRows([
      ...tableRows,
      {
        id: key,
        value: paymentPlanValueItem,

        dateParsed: dateISO,
        dateISOString: dateISO,
        paymentType: paymentPlanPaymentType
          ? paymentPlanPaymentType
          : PaymentType.other,
      },
    ]);

    setPaymentPlanValueItem(undefined);
    setPaymentPlanPaymentType(null);
    setPaymentPlanDateItem(null);
    setDescription("");
  };
  const onRowDelete = (key: number) => {
    setTableRows(tableRows.filter((item, index) => index !== key));
  };

  return (
    <React.Fragment>
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
          <Title order={5}>Add Individual Item</Title>
          <Flex
            direction="row"
            align="flex-start"
            gap="md"
            justify="flex-start"
          >
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
        <Card.Section inheritPadding py="md">
          <Title order={5}>Add Recurring Items</Title>
          <Flex
            direction="row"
            align="flex-start"
            gap="md"
            justify="flex-start"
          >
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
            <Select
              value={PaymentType.installment}
              readOnly
              //onChange={onSetRecurringPaymentType}
              label={"payment type"}
              data={data}
            />
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
      </Card>
      <Card>
        <Card.Section inheritPadding py="md">
          <Table highlightOnHover fontSize="lg">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment Type</th>

                <th>Value</th>
                <th>Delete Values</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((item, index) => {
                console.log(deleteEndIndex, deleteStartIndex, "mizee");
                return (
                  <tr key={index}>
                    <td>{new Date(`${item.dateISOString}`).toDateString()}</td>
                    <td>{item.paymentType}</td>
                    <td>{item.value}</td>
                    {index === deleteStartIndex ? (
                      <td>
                        <Button
                          variant="outline"
                          onClick={() =>
                            onSeriesDelete(deleteStartIndex, deleteEndIndex!)
                          }
                        >
                          Delete
                        </Button>
                      </td>
                    ) : !deleteStartIndex && !deleteEndIndex ? (
                      <td>
                        <Button
                          variant="outline"
                          onClick={() => onRowDelete(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    ) : Number.isInteger(deleteStartIndex) &&
                      Number.isInteger(deleteEndIndex) &&
                      (index < deleteStartIndex! || index > deleteEndIndex!) ? (
                      <td>
                        <Button
                          variant="outline"
                          onClick={() => onRowDelete(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    ) : undefined}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Section>
      </Card>
    </React.Fragment>
  );
};

type PaymentInputProps = {
  tableRows: TableRowItem[];
  setTableRows: (rows: TableRowItem[]) => void;
  title: string;
  showDescriptionField?: boolean;
};

export const PaymentPlanInput: React.FC<PaymentInputProps> = (props) => {
  const { tableRows, setTableRows, title, showDescriptionField } = props;
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>{title}</Title>
      </Card.Section>

      <PaymentPlanTableRows tableRows={tableRows} setTableRows={setTableRows} />
    </Card>
  );
};
