import * as React from "react";
import { PaymentType } from "@prisma/client";
import { addMonth, formatAddTime } from "@/utilities";

import { Button, Table, Card } from "@mantine/core";

import { RecurringItemViewCard } from "./RecurringItemViewCard";
import { AddRecurringItemsInput } from "./AddRecurringItemsInput";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { AddIndividualItemInput } from "./AddIndividualItemInput";

interface PaymentPlanTableProps {
  tableRows: TableRowItem[];
  setTableRows: (data: TableRowItem[]) => void;
}

export const PaymentPlanInputTable: React.FC<PaymentPlanTableProps> = (props) => {
  // props
  const { tableRows, setTableRows } = props;

  // individual payment plan item props
  const [paymentPlanDateItem, setPaymentPlanDateItem] =
    React.useState<Date | null>(null);
  const [paymentPlanValueItem, setPaymentPlanValueItem] = React.useState<
    number | undefined
  >(undefined);
  const [paymentPlanPaymentType, setPaymentPlanPaymentType] =
    React.useState<PaymentType | null>();
  // series payment plan props
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
  const [isSeriesGenerated, setIsSeriesGenerated] = React.useState(false);

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
  let TotalValue = 0;
  tableRows.length
    ? tableRows.forEach((item) => {
        return (TotalValue = TotalValue + item.value!);
      })
    : 0;
  const onPaymentTypeChange = (val: PaymentType | null) => {
    setPaymentPlanPaymentType(val);
  };

  const onAddSeries = () => {
    const startDateISO = formatAddTime(`${recurringPlanStartDate}`);

    let recurringMonthDateVal = startDateISO;
    const endDateISO = formatAddTime(`${recurringPlanEndDate}`);

    setDeleteStartIndex(tableRows?.length ? tableRows?.length : 0);

    let addRows: TableRowItem[] = [];

    while (recurringMonthDateVal <= endDateISO) {
      const key: number = tableRows?.length ? tableRows?.length : 0;
      // we have to add first value before changing
      if (recurringMonthDateVal === startDateISO) {
        addRows.push({
          id: key,
          value: recurringPlanValue,
          dateParsed: recurringMonthDateVal,
          dateISOString: recurringMonthDateVal,
          paymentType: recurringPlanPaymentType
            ? recurringPlanPaymentType
            : PaymentType.other,
        });
        recurringMonthDateVal = addMonth(
          recurringMonthDateVal,
          recurringMonth!
        );
      } else {
        const obj = {
          id: key,
          value: recurringPlanValue,
          dateParsed: recurringMonthDateVal,
          dateISOString: recurringMonthDateVal,
          paymentType: recurringPlanPaymentType
            ? recurringPlanPaymentType
            : PaymentType.other,
        };
        addRows.push(obj);
        recurringMonthDateVal = addMonth(
          recurringMonthDateVal,
          recurringMonth!
        );
      }
    }

    setTableRows([...tableRows, ...addRows]);
    setDeleteEndIndex(tableRows?.length + addRows.length - 1);
    setIsSeriesGenerated(true);
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
    setIsSeriesGenerated(false);
    setRecurringPlanEndDate(null);
    setRecurringPlanStartDate(null);
    setRecurringPlanValue(undefined);
    setRecurringMonth(undefined);
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
  };
  const onDeleteRow = (key: number) => {
    // We have to vheck if we are deleting items above generated series, then we need to shift deleteStartIndex and deleteEndIndex of generated series
    if (deleteStartIndex && key < deleteStartIndex) {
      setDeleteStartIndex(deleteStartIndex - 1);
      setDeleteEndIndex(deleteEndIndex! - 1);
    }
    setTableRows(tableRows.filter((item, index) => index !== key));
  };

  const addrecurringItems = {
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
  };
  const seriesDetailCard = {
    recurringMonth,
    recurringPlanEndDate,
    recurringPlanStartDate,
    recurringPlanValue,
    recurringPlanPaymentType,
  };

  const addIndividualItemInput = {
    paymentPlanDateItem,
    setPaymentPlanDateItem,
    paymentPlanPaymentType,
    onPaymentTypeChange,
    data,
    paymentPlanValueItem,
    setPaymentPlanValueItem,
    onAddRow,
  };

  const paymentPlanInputTableView = {
    deleteStartIndex,
    deleteEndIndex,
    TotalValue,
    tableRows,
    onSeriesDelete,
    onDeleteRow,
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
        <AddIndividualItemInput {...addIndividualItemInput} />
        {!isSeriesGenerated ? (
          <AddRecurringItemsInput {...addrecurringItems} />
        ) : (
          <RecurringItemViewCard {...seriesDetailCard} />
        )}
      </Card>
      <PaymentPlanInputTableView {...paymentPlanInputTableView} />
    </React.Fragment>
  );
};

type PaymentPlanInputTableView = {
  deleteStartIndex: number | undefined;
  deleteEndIndex: number | undefined;
  TotalValue: number;
  tableRows: TableRowItem[];
  onSeriesDelete: (startVal: number, endVal: number) => void;
  onDeleteRow: (val: number) => void;
};

const PaymentPlanInputTableView: React.FC<PaymentPlanInputTableView> = (
  props: PaymentPlanInputTableView
) => {
  const {
    deleteStartIndex,
    deleteEndIndex,
    TotalValue,
    tableRows,
    onSeriesDelete,
    onDeleteRow,
  } = props;
  return (
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
              return (
                <tr key={index}>
                  <td>{new Date(`${item.dateISOString}`).toDateString()}</td>
                  <td>{item.paymentType}</td>
                  <td>
                    {`${item.value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
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
                        onClick={() => onDeleteRow(index)}
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
                        onClick={() => onDeleteRow(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  ) : undefined}
                </tr>
              );
            })}
            {tableRows.length ? (
              <tr key={tableRows.length}>
                <td>Total</td>
                <td></td>
                <td>{`${TotalValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
              </tr>
            ) : undefined}
          </tbody>
        </Table>
      </Card.Section>
    </Card>
  );
};
