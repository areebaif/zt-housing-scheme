import * as React from "react";
import {
  Card,
  Table,
  Title,
  Group,
  Button,
  Modal,
  Text,
  Grid,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Payments } from "@prisma/client";
import { PlotDetail } from "@/pages/api/housingScheme/[housingSchemeId]/plot/[id]";
import { deletePayment } from "@/r-query/functions";

export type PaymentHistoryTableProps = {
  tableRows?: Payments[];
  plotDetail: PlotDetail;
  setShowAddPaymentForm: (val: boolean) => void;
};

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = (
  PaymentHistoryTable
) => {
  // Props
  const { tableRows, setShowAddPaymentForm } = PaymentHistoryTable;
  const [opened, { open, close }] = useDisclosure(false);
  const [deletePaymentVal, setDeletePaymentVal] = React.useState<{
    id: number;
    type: string;
    date: string;
    value: number;
  }>();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries();
      close();
      // setPayment form false
      //setShowAddPaymentForm(false);
      //router.push(`/plot/${plotNumber[0].id}`);
    },
  });

  const onShowModal = (
    id: number,
    type: string,
    date: string,
    value: number
  ) => {
    setDeletePaymentVal({ id, type, date, value });
    open();
  };

  const onDeletePaymentSubmit = () => {
    if (deletePaymentVal?.id) mutation.mutate(deletePaymentVal.id);
  };
  if (mutation.isLoading) {
    return <Loader />;
  }

  if (mutation.isError) {
    return <>Something went wrong, please try again!</>;
  }

  // Display Funcs
  const paymentHistoryRows = tableRows?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    return (
      <>
        <tr key={element.id}>
          <td>{element.payment_type}</td>
          <td>{element.description}</td>
          <td>{date.toDateString()}</td>
          <td>
            {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>
            <Button
              variant="outline"
              onClick={() =>
                onShowModal(
                  element.id,
                  element.payment_type,
                  date.toDateString(),
                  element.payment_value
                )
              }
            >
              Delete
            </Button>
          </td>
        </tr>
      </>
    );
  });

  const modalCardProps = {
    id: deletePaymentVal?.id,
    type: deletePaymentVal?.type,
    date: deletePaymentVal?.date,
    value: deletePaymentVal?.value,
    close,
    opened,
    onDeletePaymentSubmit,
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ margin: "25px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Title order={3}>Payment History</Title>
          <Button
            onClick={() => {
              setShowAddPaymentForm(true);
            }}
          >
            Add Payment
          </Button>
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Table highlightOnHover fontSize="lg">
          <thead>
            <tr>
              <th>PaymentType</th>
              <th>Description</th>
              <th>Date</th>
              <th>Value</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{paymentHistoryRows}</tbody>
        </Table>
        <ModalCard {...modalCardProps} />
      </Card.Section>
    </Card>
  );
};

type ModalCardProps = {
  id: number | undefined;
  type: string | undefined;
  date: string | undefined;
  value: number | undefined;
  close: () => void;
  opened: boolean;
  onDeletePaymentSubmit: () => void;
};

const ModalCard: React.FC<ModalCardProps> = (props: ModalCardProps) => {
  const { id, type, date, value, opened, close, onDeletePaymentSubmit } = props;

  return (
    <Modal
      overlayOpacity={0.6}
      opened={opened}
      onClose={close}
      size={"xl"}
      title={
        <Title order={4} ta="center">
          Delete Payment
        </Title>
      }
      centered
    >
      <Text size={"lg"}>
        Are you sure you want to delete the payment with the following
        information:
      </Text>{" "}
      <Grid mt={"lg"} mb={"lg"} grow>
        <Grid.Col span={4}>
          <Text weight={"bold"}>Payment Type:</Text> <Text>{type} </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text weight={"bold"}>Date:</Text> <Text>{date} </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text weight={"bold"}>Value:</Text>{" "}
          <Text>{`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </Text>
        </Grid.Col>
      </Grid>
      <Group position="center" mt="lg">
        <Button size="md" onClick={close}>
          No
        </Button>
        <Button size="md" onClick={onDeletePaymentSubmit}>
          Yes
        </Button>
      </Group>
    </Modal>
  );
};
