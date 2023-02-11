import * as React from "react";
import { Card, TextInput, Flex, Title } from "@mantine/core";

type PlotDetailsInputProps = {
  plotId: string;
  setPlotId: (plotId: string) => void;
  squareFeet: string;
  setSquareFeet: (sqFeet: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
};
export const PlotDetailsInput: React.FC<PlotDetailsInputProps> = (props) => {
  const {
    plotId,
    //setPlotId,
    squareFeet,
    //setSquareFeet,
    dimension,
    //setDimension,
  } = props;
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Plot Details</Title>
      </Card.Section>
      <Card.Section inheritPadding py="md">
        <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
          <TextInput
            value={plotId}
            //onChange={(event) => setPlotId(event.currentTarget.value)}
            withAsterisk
            error={
              isNaN(parseInt(plotId)) ? "please enter a valid plot number" : ""
            }
            label="plot number"
            placeholder="plot number"
            disabled={true}
          />
          <TextInput
            value={squareFeet ? squareFeet : ""}
            //onChange={(event) => setSquareFeet(event.currentTarget.value)}
            error={
              isNaN(parseInt(squareFeet ? squareFeet : ""))
                ? "please enter a valid dimension"
                : ""
            }
            label="square ft"
            placeholder="square ft"
            disabled={true}
          />
          <TextInput
            value={dimension ? dimension : ""}
            label="dimension"
            //onChange={(event) => setDimension(event.currentTarget.value)}
            placeholder="dimension"
            disabled={true}
          />
        </Flex>
      </Card.Section>
    </Card>
  );
};
