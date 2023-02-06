import * as React from "react";
import {PlotsSelectFields} from "@/pages/api/plot/add";
import {useRouter} from "next/router";
import {Table, Text} from "@mantine/core";

export interface PlotSaleSummaryTableProps {
    tableHead: string;
    tableRows: PlotsSelectFields[];
}
export const PlotSaleSummaryTable: React.FC<PlotSaleSummaryTableProps> = (
    PlotSaleSummaryTableProps
) => {
    const { tableHead, tableRows } = PlotSaleSummaryTableProps;
    const router = useRouter();

    const rows = tableRows?.map((element) => (
        <tr onClick={() => router.push(`/plot/${element.id}`)} key={element.id}>
            <td>{element.id}</td>
            <td>{element.square_feet}</td>
            <td>{element.dimension}</td>
        </tr>
    ));
    return (
        <Table highlightOnHover>
            <thead>
            <tr>
                <th colSpan={3}>
                    <Text align="center">{tableHead}</Text>
                </th>
            </tr>
            <tr>
                <th>Plot Number</th>
                <th>Square ft</th>
                <th>Dimension</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
    );
};