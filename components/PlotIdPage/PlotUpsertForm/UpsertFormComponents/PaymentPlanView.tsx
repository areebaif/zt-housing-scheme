import * as React from "react";
import { Card, Group, Button, Title, Table } from "@mantine/core";
import { TableRowItem } from "@/components/TableRowsUpsert";

type PaymentPlanView = {
  paymentPlan: TableRowItem[];
  descriptionField?: boolean;
  setTableRows: (val: TableRowItem[]) => void;
  //isEditForm: boolean;
  setShowEditFieldFlag: (val: boolean) => void;
};

export const PaymentPlanView: React.FC<PaymentPlanView> = (
  props: PaymentPlanView
) => {
  const { paymentPlan, descriptionField, setTableRows, setShowEditFieldFlag } =
    props;

  const jsxRows: JSX.Element[] = [];

  paymentPlan.forEach((item, index) => {
    const key = index;
    const date = new Date(`${item.dateISOString}`);
    const description = item.description;
    const dateString = date.toDateString();
    const value = item.value;

    jsxRows.push(
      <tr key={key}>
        <td>{dateString}</td>
        <td>{description}</td>
        <td>{value}</td>
      </tr>
    );
  });

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart" mt="3px" mb="0px">
          <Title order={3}>Payment Plan</Title>
          <Button
            variant="outline"
            onClick={() => {
              setTableRows([]);
              setShowEditFieldFlag(false);
            }}
          >
            Delete Plan
          </Button>
        </Group>
      </Card.Section>

      <Card>
        <Card.Section inheritPadding py="md">
          <Table highlightOnHover fontSize="lg">
            <thead>
              <tr>
                <th>Date</th>
                {descriptionField ? <th>Description</th> : undefined}
                <th>Value</th>
              </tr>
            </thead>
            <tbody>{jsxRows}</tbody>
          </Table>
        </Card.Section>
      </Card>
    </Card>
  );
};
