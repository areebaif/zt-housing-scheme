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
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { formatAddTime } from "../utilities";
import { ThemeContext } from "@emotion/react";

export interface TableRowItem {
  id: number;
  dateISOString: string;
  value: number | undefined;
  description?: string;
}
export interface UpsertTableRowsProps {
  //tableHeader: string;
  tableRows: TableRowItem[];
  setTableRows: (data: TableRowItem[]) => void;
  descriptionField?: boolean;
}

export const UpsertTableRows: React.FC<UpsertTableRowsProps> = (
  UpsertTableRowsProps
) => {
  // props
  const { tableRows, setTableRows, descriptionField } = UpsertTableRowsProps;
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
              withAsterisk
              error={!paymentPlanDateItem}
              value={paymentPlanDateItem}
              onChange={setPaymentPlanDateItem}
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
              withAsterisk
              onChange={(val) => setPaymentPlanValueItem(val)}
              parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
              error={
                paymentPlanValueItem
                  ? paymentPlanValueItem < 1
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
