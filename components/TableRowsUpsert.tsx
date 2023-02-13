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
  dateISOString?: string;
  value: number | undefined;
  description?: string;
  paymentType: PaymentType;
}
export interface UpsertTableRowsProps {
  //tableHeader: string;
  tableRows: TableRowItem[];
  setTableRows: (data: TableRowItem[]) => void;
  descriptionField?: boolean;
  showDevelopmentCharge?: boolean;
}

export const UpsertTableRows: React.FC<UpsertTableRowsProps> = (
  UpsertTableRowsProps
) => {
  // props
  const { tableRows, setTableRows, descriptionField, showDevelopmentCharge } =
    UpsertTableRowsProps;

  // state
  const [fixedPaymentPlan, setFixedPaymentPlan] = React.useState<JSX.Element[]>(
    []
  );
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

  if (showDevelopmentCharge) {
    data = [
      {
        value: PaymentType.development_charge,
        label: "development charge",
      },
      { value: PaymentType.installment, label: "installment" },
      { value: PaymentType.other, label: "other" },
    ];
  } else {
    data = [
      { value: PaymentType.installment, label: "installment" },
      { value: PaymentType.other, label: "other" },
    ];
  }

  const onPaymentTypeChange = (val: PaymentType | null) => {
    setPaymentPlanPaymentType(val);
  };

  const onRowDelete = (key: number) => {
    setFixedPaymentPlan(
      fixedPaymentPlan.filter((item, index) => index !== key - 1)
    );

    setTableRows(tableRows.filter((item, index) => index !== key - 1));
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

    const key = fixedPaymentPlan?.length + 1;
    const date = new Date(`${paymentPlanDateItem}`);
    const dateISO = formatAddTime(`${paymentPlanDateItem}`);
    const dateString = date.toDateString();
    const paymnetType = paymentPlanPaymentType;

    setTableRows([
      ...tableRows,
      {
        id: key,
        value: paymentPlanValueItem,
        description: description,
        dateParsed: dateISO,
        dateISOString: dateISO,
        paymentType: paymentPlanPaymentType
          ? paymentPlanPaymentType
          : PaymentType.other,
      },
    ]);

    setFixedPaymentPlan((el) => [
      ...fixedPaymentPlan,
      <tr key={key}>
        <td>{dateString}</td>
        <td>{paymnetType}</td>
        <td>{description}</td>
        <td>{paymentPlanValueItem}</td>
        <td>
          <Button variant="outline" onClick={() => onRowDelete(key)}>
            Delete
          </Button>
        </td>
      </tr>,
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
            {descriptionField ? (
              <TextInput
                value={description}
                label="description"
                onChange={(event) => setDescription(event.currentTarget.value)}
                placeholder="description"
              />
            ) : undefined}
            <NumberInput
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
                {descriptionField ? <th>Description</th> : undefined}
                <th>Value</th>
                <th>Delete Values</th>
              </tr>
            </thead>
            <tbody>{fixedPaymentPlan}</tbody>
          </Table>
        </Card.Section>
      </Card>
    </React.Fragment>
  );
};
