import * as React from "react";
import { Payments } from "@prisma/client";
import { Card, TransferList, TransferListData } from "@mantine/core";

type PaymentRefundTableProps = {
  paymentRefundData: TransferListData;
  setPaymentRefundData: (val: TransferListData) => void;
};

export const PaymentRefundTable: React.FC<PaymentRefundTableProps> = ({
  paymentRefundData,
  setPaymentRefundData,
}) => {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ margin: "25px 0 0 0" }}
    >
      <TransferList
        value={paymentRefundData}
        onChange={setPaymentRefundData}
        searchPlaceholder="Search..."
        nothingFound="Nothing here"
        titles={["Payments", "Refund Payments"]}
        breakpoint="sm"
      />
    </Card>
  );
};
