import * as React from "react";
import { Card, Group, Button, Title, Table, TextInput } from "@mantine/core";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";

type PaymentPlanEditView = {
  paymentPlan: TableRowItem[];
  setTableRows: (val: TableRowItem[]) => void;
  setShowEditFieldFlag: (val: boolean) => void;
  setIsEditPaymentPlan: (val: boolean) => void;
};

export const PaymentPlanEditView: React.FC<PaymentPlanEditView> = (
  props: PaymentPlanEditView
) => {
  const {
    paymentPlan,
    setTableRows,
    setShowEditFieldFlag,
    setIsEditPaymentPlan,
  } = props;

  let TotalValue = 0;
  paymentPlan.length
    ? paymentPlan.forEach((item) => {
        return (TotalValue = TotalValue + item.value!);
      })
    : 0;

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
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {paymentPlan.map((item, index) => {
                const key = index;
                const date = new Date(`${item.dateISOString}`);
                const paymentType = item.paymentType;
                const dateString = date.toDateString();
                const value = item.value;
                return (
                  <tr key={key}>
                    <td>{dateString}</td>
                    <td>{paymentType}</td>
                    <td>{`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                  </tr>
                );
              })}
              {paymentPlan.length ? (
                <tr key={paymentPlan.length}>
                  <td>Total</td>
                  <td></td>
                  <td>
                    {`${TotalValue}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
              ) : undefined}
            </tbody>
          </Table>
        </Card.Section>
      </Card>
    </Card>
  );
};
