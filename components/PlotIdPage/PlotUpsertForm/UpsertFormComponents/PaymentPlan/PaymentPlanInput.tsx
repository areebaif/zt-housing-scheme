import * as React from "react";
import { Card, Title } from "@mantine/core";
import { PaymentPlanInputTable } from "./PaymentPlanInputTable";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";

// export enum TypePayment {
//   down_payment = "down_payment",
//   development_charge = "development_charge",
//   installment = "installment",
//   other = "other",
// }

type PaymentPlanInputProps = {
  tableRows: TableRowItem[];
  setTableRows: (rows: TableRowItem[]) => void;
  title: string;
};

export const PaymentPlanInput: React.FC<PaymentPlanInputProps> = (
  props
) => {
  const { tableRows, setTableRows, title } = props;
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
      <PaymentPlanInputTable tableRows={tableRows} setTableRows={setTableRows} />
    </Card>
  );
};
