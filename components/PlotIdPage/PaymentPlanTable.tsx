import * as React from "react";
import { Table, Text, Title, Card } from "@mantine/core";
import { Payment_Plan } from "@prisma/client";

export type PaymentPlanTable = {
  tableRows?: Payment_Plan[];
  customerName?: string;
  sonOf?: string | null;
};

export const PaymentPlanTable: React.FC<PaymentPlanTable> = (
  PaymentPlanTable
) => {
  const { tableRows, customerName, sonOf } = PaymentPlanTable;
  const paymentPlanRows = tableRows?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    return (
      <tr key={element.id}>
        <td>{customerName}</td>
        <td>{sonOf}</td>
        <td>{element.payment_type}</td>
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
        <Title order={3}>Payment Plan</Title>
      </Card.Section>
      <Card.Section p="md">
        <Table fontSize={"lg"} highlightOnHover>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Son/ of</th>
              <th>Payment Type</th>
              <th>Estimated Payment Date</th>
              <th>Estimated Payment Value</th>
            </tr>
          </thead>
          <tbody>{paymentPlanRows}</tbody>
        </Table>
      </Card.Section>
    </Card>
  );
};
