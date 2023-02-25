import * as React from "react";
import { Card, Title, Flex, Text } from "@mantine/core";
import { PlotDetail } from "@/pages/api/plot/[id]";

export type SellInfoProps = {
  plotDetail: PlotDetail;
  totalPayment: number;
};

export const SellInfo: React.FC<SellInfoProps> = (props) => {
  const { plotDetail, totalPayment } = props;
  return (
    <Card style={{ height: "100%" }} shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Sell Information </Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Flex
          direction="column"
          align="flex-start"
          gap="md"
          justify="flex-start"
        >
          <Text>
            <Text span weight={"bold"}>
              Sell Price:{" "}
            </Text>
            {plotDetail?.sale?.sold_price
              ? `${plotDetail?.sale?.sold_price}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
              : ""}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Sell Date:{" "}
            </Text>
            {plotDetail?.sale?.sold_date
              ? new Date(`${plotDetail?.sale?.sold_date}`).toDateString()
              : ""}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Total Payment Recieved:{" "}
            </Text>
            {totalPayment
              ? `${totalPayment}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Customer CNIC:
            </Text>{" "}
            {plotDetail?.customer?.cnic}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Customer Name:
            </Text>{" "}
            {plotDetail?.customer?.name}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Son/of:{" "}
            </Text>
            {plotDetail?.customer?.son_of}{" "}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Phone No:{" "}
            </Text>
            {plotDetail?.customer?.phone_number}{" "}
          </Text>
          <Text>
            <Text span weight={"bold"}>
              Address:{" "}
            </Text>
            {plotDetail?.customer?.address}{" "}
          </Text>
        </Flex>
      </Card.Section>
    </Card>
  );
};
