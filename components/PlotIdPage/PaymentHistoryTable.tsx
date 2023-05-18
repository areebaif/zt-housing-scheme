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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Payments } from "@prisma/client";
import { PlotDetail } from "@/pages/api/plot/[id]";

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
  const [deletePaymentVal, setDeletePaymentVal] = React.useState({});

  // Display Funcs
  const paymentHistoryRows = tableRows?.map((element) => {
    const date = new Date(`${element.payment_date}`);

    const onShowModal = (
      id: number,
      type: string,
      date: string,
      value: number
    ) => {
      console.log(id, type, date, value);
      open();
      // find the relevant record in table rows
      //const deleteRecord = tableRows.filter((payment) => payment.id === id);
      // here you will trigger a backend call
    };
    return (
      <>
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
              <Text weight={"bold"}>Payment Type:</Text> <Text>{1} </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text weight={"bold"}>Date:</Text> <Text>{} </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text weight={"bold"}>Value:</Text> <Text>{} </Text>
            </Grid.Col>
          </Grid>
          <Group position="center" mt="lg">
            <Button size="md" onClick={close}>
              No
            </Button>
            <Button size="md">Yes</Button>
          </Group>
        </Modal>
        <tr key={element.id}>
          {/*<td>{element.id}</td>*/}
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
              <th>Payment Number</th>
              <th>PaymentType</th>
              <th>Description</th>
              <th>Date</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{paymentHistoryRows}</tbody>
        </Table>
      </Card.Section>
    </Card>
  );
};
