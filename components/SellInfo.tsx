import * as React from "react";
import {Card, Title, Flex, Text} from "@mantine/core";
import {PlotDetail} from "@/pages/api/plot/[id]";

export type SellInfoProps = {
    plotDetail: PlotDetail;
    totalPayment: number;
}


export const SellInfo: React.FC<SellInfoProps> = (props) => {
    const { plotDetail, totalPayment } = props;
    return (
        <Card shadow="sm" p="lg" radius="md" withBorder style={{ margin: "25px 0 0 0" }}>
            <Card.Section withBorder inheritPadding py="xs">
                <Title order={3}>Sell Information </Title>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
                <Flex direction="column" align="flex-start" gap="md" justify="flex-start">
                    <Text>
                        Sell Price:{" "}
                        {`${plotDetail?.plot?.sold_price}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                        )}{" "}
                    </Text>
                    <Text>
                        Sell Date: {new Date(`${plotDetail?.plot.sold_date}`).toDateString()}{" "}
                    </Text>
                    <Text>
                        Total Payment Recieved:{" "}
                        {`${totalPayment}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    </Text>
                    <Text>
                        Customer Name: {plotDetail?.customer?.name} Son/of:{" "}
                        {plotDetail?.customer?.son_of}{" "}
                    </Text>
                    <Text>Customer cnic: {plotDetail?.customer?.cnic}</Text>
                </Flex>
            </Card.Section>
        </Card>
    )
}