import * as React from "react";
import { Card, Table, Title, Group, Button } from "@mantine/core";
import { Payments } from "@prisma/client";
import { PlotDetail } from "@/pages/api/plot/[id]";
import { useRouter } from "next/router";

export type PaymentHistoryTableProps = {
  tableRows?: Payments[];
  plotDetail: PlotDetail;
  setShowAddPaymentForm: (val: boolean) => void;
};

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = (
  PaymentHistoryTable
) => {
  //Props
  const { tableRows, setShowAddPaymentForm } = PaymentHistoryTable;
  // Display Funcs
  const paymentHistoryRows = tableRows?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    return (
      <tr key={element.id}>
        <td>{element.id}</td>
        <td>{element.payment_type}</td>
        <td>{element.description}</td>
        <td>{date.toDateString()}</td>
        <td>
          {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
      </tr>
    );
  });

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ margin: "25px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Title order={3}>Payment History</Title>
          <Button
            onClick={() => {
              setShowAddPaymentForm(true);
            }}
          >
            Add Payment
          </Button>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Table highlightOnHover fontSize="lg">
          <thead>
            <tr>
              <th>Payment Number</th>
              <th>PaymentType</th>
              <th>Description</th>
              <th>Date</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{paymentHistoryRows}</tbody>
        </Table>
      </Card.Section>
    </Card>
  );
};
