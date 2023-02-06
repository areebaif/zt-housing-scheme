import * as React from "react";
import {Button, Card, Title, Grid, Group, Text} from "@mantine/core"
import {useRouter} from "next/router";
import {Payments} from "@prisma/client";
import {PlotDetail} from "@/pages/api/plot/[id]";

export interface PlotBasicInfoProps {
    plotDetail: PlotDetail;
    plotId: string;
}

export const PlotBasicInfo: React.FC<PlotBasicInfoProps> = (props) => {
    //Props
    const { plotDetail, plotId } = props;
    //Hooks
    const router = useRouter();
    return (
        <Card shadow="sm" p="lg" radius="md" withBorder style={{ margin: "25px 0 0 0" }}>
            <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart" mt="md" mb="xs">
                    <Title order={3}>Basic Information</Title>
                    <Button
                        onClick={() =>
                            router.push(
                                `/plot/sale/${plotId}?dimension=${plotDetail?.plot?.dimension}&squareFeet=${plotDetail?.plot?.square_feet}`
                            )
                        }
                    >
                        {plotDetail?.plot.status === "not_sold" ? "Add Sale" : "Edit Details"}
                    </Button>
                </Group>
            </Card.Section>
            <Card.Section inheritPadding py="xs">
                <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                    <Grid.Col span={3}><Text weight={"bold"}>Plot Number:</Text> <Text>{plotDetail?.plot?.id} </Text></Grid.Col>
                    <Grid.Col span={3}><Text weight={"bold"}>Square ft:</Text> <Text>{plotDetail?.plot?.square_feet} </Text></Grid.Col>
                    <Grid.Col span={3}><Text weight={"bold"}>Dimension:</Text> <Text>{plotDetail?.plot?.dimension} </Text></Grid.Col>
                </Grid>
            </Card.Section>
        </Card>
    )
}