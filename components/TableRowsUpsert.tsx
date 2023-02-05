import * as React from "react";
import {
  Button,
  Table,
  Text,
  NumberInput,
  Box,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { formatAddTime } from "../utilities";

export interface TableRowItem {
  id: number;
  dateISOString: string;
  value: number | undefined;
  description?: string;
}
export interface UpsertTableRowsProps {
  tableHeader: string;
  tableRows: TableRowItem[];
  setTableRows: (data: TableRowItem[]) => void;
  descriptionField?: boolean;
}

export const UpsertTableRows: React.FC<UpsertTableRowsProps> = (
  UpsertTableRowsProps
) => {
  // props
  const { tableRows, setTableRows, tableHeader, descriptionField } =
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

  const onRowDelete = (key: number) => {
    let paymentPlanDelete: JSX.Element[] = [];
    if (fixedPaymentPlan.length) {
      paymentPlanDelete = fixedPaymentPlan.filter(
        (item, index) => index !== key - 1
      );
    }
    setFixedPaymentPlan(paymentPlanDelete);
    let filteredRow: TableRowItem[] = [];
    if (tableRows.length) {
      filteredRow = tableRows.filter((item, index) => index !== key - 1);
    }
    setTableRows(filteredRow);
  };

  const onAddRow = () => {
    // do some validation here aswell
    if (!paymentPlanDateItem || !paymentPlanValueItem) {
      throw new Error("please enter date and value to add row");
    }
    const paymentPlanAdd = [];
    if (fixedPaymentPlan.length) {
      fixedPaymentPlan.forEach((item) => paymentPlanAdd.push(item));
    }
    const key = fixedPaymentPlan?.length + 1;
    const date = new Date(`${paymentPlanDateItem}`);
    const dateISO = formatAddTime(`${paymentPlanDateItem}`);
    const dateString = date.toDateString();

    const data = [
      ...tableRows,
      {
        id: key,
        value: paymentPlanValueItem,
        description: description,
        dateISOString: dateISO,
      },
    ];
    setTableRows(data);

    setFixedPaymentPlan((el) => [
      ...fixedPaymentPlan,
      <tr key={key}>
        <td>{dateString}</td>
        {description ? <td>{description}</td> : undefined}
        <td>{paymentPlanValueItem}</td>
        <td>
          <Button variant="outline" onClick={() => onRowDelete(key)}>
            Delete
          </Button>
        </td>
      </tr>,
    ]);
    setPaymentPlanValueItem(undefined);
    setPaymentPlanDateItem(null);
    setDescription("");
  };
  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th colSpan={3}>
            <Text align="center">{tableHeader}</Text>
          </th>
        </tr>
        <tr>
          <th>Date</th>
          {descriptionField ? <th>Description</th> : undefined}
          <th>Value</th>
          <th>Add or Delete Values</th>
        </tr>
      </thead>
      <tbody>
        {fixedPaymentPlan}
        <tr>
          <td>
            <Box>
              <DatePicker
                inputFormat="ddd MMM D YYYY"
                label={"select date"}
                placeholder={"dd/mm/yyyy"}
                withAsterisk
                value={paymentPlanDateItem}
                onChange={setPaymentPlanDateItem}
              />
            </Box>
          </td>
          {descriptionField ? (
            <td>
              <TextInput
                value={description}
                label="description"
                onChange={(event) => setDescription(event.currentTarget.value)}
                placeholder="description"
              />
            </td>
          ) : undefined}
          <td>
            <NumberInput
              label="payment value"
              value={paymentPlanValueItem}
              withAsterisk
              placeholder={"enter value to be collected"}
              onChange={(val) => setPaymentPlanValueItem(val)}
              parser={(sellPrice) => sellPrice?.replace(/\$\s?|(,*)/g, "")}
              error={
                paymentPlanValueItem
                  ? paymentPlanValueItem < 0
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
          </td>
          <td>
            {
              <Button variant="outline" onClick={onAddRow}>
                Add Values
              </Button>
            }
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
