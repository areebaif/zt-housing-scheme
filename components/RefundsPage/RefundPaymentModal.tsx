import { Modal, TransferListData } from "@mantine/core";
import { PaymentRefundTable } from "../PlotIdPage/PaymentRefundTable";
import { refundPlotData } from "@/pages/api/plot/refundSummary";
import { PlotSummaryModal } from "./PlotSummaryModal";

type RefundPaymentModalProps = {
  opened: boolean;
  close: () => void;
  plotData: refundPlotData | undefined;
  paymentRefundData: TransferListData;
  setPaymentRefundData: (val: TransferListData) => void;
};

export const RefundPaymentModal: React.FC<RefundPaymentModalProps> = ({
  opened,
  close,
  paymentRefundData,
  setPaymentRefundData,
  plotData,
}) => {
  const { sale, customer, payments } = plotData!;

  const ModalPlotSummaryProps = {
    plotId: sale.plotId,
    name: customer.name,
    sonOf: customer.son_of,
    salePrice: sale.sale_price,
    saleDate: sale.sold_date,
    payments,
  };

  return (
    <Modal opened={opened} onClose={close} centered size="70%">
      <PlotSummaryModal {...ModalPlotSummaryProps} />
      <PaymentRefundTable
        paymentRefundData={paymentRefundData}
        setPaymentRefundData={setPaymentRefundData}
      />
    </Modal>
  );
};
