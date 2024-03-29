import * as React from "react";
import { TableRowItem } from "./PaymentInputTable";
import { Card, Title } from "@mantine/core";
import { PaymentInputTable } from "./PaymentInputTable";

type PaymentInputProps = {
  tableRows: TableRowItem[];
  setTableRows: (rows: TableRowItem[]) => void;
  title: string;
  showDescriptionField?: boolean;
};

export const PaymentInput: React.FC<PaymentInputProps> = (props) => {
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
      <PaymentInputTable
        tableRows={tableRows}
        setTableRows={setTableRows}
        showDescriptionField={showDescriptionField}
      />
    </Card>
  );
};
