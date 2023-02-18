import * as React from "react";
import { Card, Group, Button, Title, Table, TextInput } from "@mantine/core";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";

type PaymentPlanView = {
  paymentPlan: TableRowItem[];
  descriptionField?: boolean;
  setTableRows: (val: TableRowItem[]) => void;
  //isEditForm: boolean;
  setShowEditFieldFlag: (val: boolean) => void;
  setIsEditPaymentPlan: (val: boolean) => void;
};

export const PaymentPlanView: React.FC<PaymentPlanView> = (
  props: PaymentPlanView
) => {
  const {
    paymentPlan,
    descriptionField,
    setTableRows,
    setShowEditFieldFlag,
    setIsEditPaymentPlan,
  } = props;

  const jsxRows: JSX.Element[] = [];

  paymentPlan.forEach((item, index) => {
    const key = index;
    const date = new Date(`${item.dateISOString}`);
    const paymentType = item.paymentType;
    const description = item.description;
    const dateString = date.toDateString();
    const value = item.value;

    jsxRows.push(
      <tr key={key}>
        <td>{dateString}</td>
        <td>{paymentType}</td>
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
              setIsEditPaymentPlan(true);
            }}
          >
            Delete Plan
          </Button>
        </Group>
      </Card.Section>

      <Card>
        <Card.Section inheritPadding py="md">
          <TextInput
            variant={"unstyled"}
            value={
              "Note: If you want to edit the payment plan then delete this plan and add a new plan from scratch"
            }
            readOnly={true}
            error={true}
          />

          <Table highlightOnHover fontSize="lg">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment Type</th>
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
