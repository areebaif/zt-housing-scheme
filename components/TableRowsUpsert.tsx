import * as React from "react";
import {
  Button,
  Table,
  Text,
  NumberInput,
  Box,
  TextInput,
  Flex,
  Card,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { formatAddTime } from "../utilities";
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
  showDescriptionField?: boolean;
}

export const UpsertTableRows: React.FC<UpsertTableRowsProps> = (
  UpsertTableRowsProps
) => {
  // props
  const { tableRows, setTableRows, showDescriptionField } =
    UpsertTableRowsProps;

  const [description, setDescription] = React.useState("");
  const [paymentPlanDateItem, setPaymentPlanDateItem] =
    React.useState<Date | null>(null);
  const [paymentPlanValueItem, setPaymentPlanValueItem] = React.useState<
    number | undefined
  >(undefined);
  const [paymentPlanPaymentType, setPaymentPlanPaymentType] =
    React.useState<PaymentType | null>();

  let data: {
    value: PaymentType;
    label: string;
  }[];

  data = [
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

  const onRowDelete = (key: number) => {
    setTableRows(tableRows.filter((item, index) => index !== key));
  };

  const onAddRow = () => {
    // do some validation here aswell
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
        description: showDescriptionField ? description : undefined,
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
            {showDescriptionField ? (
              <TextInput
                value={description}
                label="description"
                onChange={(event) => setDescription(event.currentTarget.value)}
                placeholder="description"
              />
            ) : undefined}
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
      </Card>
      <Card>
        <Card.Section inheritPadding py="md">
          <Table highlightOnHover fontSize="lg">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment Type</th>
                {showDescriptionField ? <th>Description</th> : undefined}
                <th>Value</th>
                <th>Delete Values</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{new Date(`${item.dateISOString}`).toDateString()}</td>
                    <td>{item.paymentType}</td>
                    {showDescriptionField ? (
                      <td>{item.description}</td>
                    ) : undefined}
                    <td>{item.value}</td>
                    <td>
                      <Button
                        variant="outline"
                        onClick={() => onRowDelete(index)}
                      >
                        Delete
                      </Button>
                    </td>
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
