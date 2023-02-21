import * as React from "react";
import { Card, Title } from "@mantine/core";
import { PaymentPlanInputTable } from "./PaymentPlanInputTable";
import { TableRowItem } from "@/components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { PaymentPlanInput } from "./PaymentPlanInput";
import { PaymentPlanEditView } from "./PaymentPlanEditView";

// export enum TypePayment {
//   down_payment = "down_payment",
//   development_charge = "development_charge",""
//   installment = "installment",
//   other = "other",
// }

type PaymentPlanInputCardProps = {
  tableRows: TableRowItem[];
  setTableRows: (rows: TableRowItem[]) => void;

  showEditFieldFlag: boolean;
  setShowEditFieldFlag: (val: boolean) => void;
  setIsEditPaymentPlan: (val: boolean) => void;
};

export const PaymentPlanInputCard: React.FC<PaymentPlanInputCardProps> = (
  props
) => {
  const {
    tableRows,
    setTableRows,
    showEditFieldFlag,
    setIsEditPaymentPlan,
    setShowEditFieldFlag,
  } = props;
  return !showEditFieldFlag ? (
    <PaymentPlanInput
      tableRows={tableRows}
      setTableRows={setTableRows}
      title={"Payment Plan"}
    />
  ) : (
    <PaymentPlanEditView
      paymentPlan={tableRows}
      setTableRows={setTableRows}
      setShowEditFieldFlag={setShowEditFieldFlag}
      setIsEditPaymentPlan={setIsEditPaymentPlan}
    />
  );
};
