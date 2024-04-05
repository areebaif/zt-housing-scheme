import { Modal, TransferListData, Button, Group } from "@mantine/core";
import { PaymentRefundTable } from "../PlotIdPage/PaymentRefundTable";
import { refundPlotData } from "@/pages/api/housingScheme/[housingSchemeId]/plot/refunds";
import { PlotSummaryModal } from "./PlotSummaryModal";

type RefundPaymentModalProps = {
  opened: boolean;
  close: () => void;
  plotData: refundPlotData | undefined;
  paymentRefundData: TransferListData;
  setPaymentRefundData: (val: TransferListData) => void;
  onSubmit: () => void;
};

export const RefundPaymentModal: React.FC<RefundPaymentModalProps> = ({
  opened,
  close,
  paymentRefundData,
  setPaymentRefundData,
  plotData,
  onSubmit,
}) => {
  const { sale, customer, payments } = plotData!;

  const ModalPlotSummaryProps = {
    plotId: sale.plotId,
    name: customer.name,
    sonOf: customer.son_of,
    salePrice: sale.total_sale_price,
    saleDate: sale.sold_date,
    payments,
  };

  return (
    <Modal
      styles={(theme) => ({
        modal: { backgroundColor: theme.colors.gray[0] },
      })}
      opened={opened}
      onClose={close}
      centered
      size="70%"
    >
      <PlotSummaryModal {...ModalPlotSummaryProps} />
      <PaymentRefundTable
        paymentRefundData={paymentRefundData}
        setPaymentRefundData={setPaymentRefundData}
      />
      <Group pt="md" position="center">
        <Button size="xl" onClick={() => onSubmit()}>
          Submit
        </Button>
      </Group>
    </Modal>
  );
};
