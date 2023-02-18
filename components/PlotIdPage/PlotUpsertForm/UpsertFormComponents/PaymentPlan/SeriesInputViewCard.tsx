import * as React from "react";
import { Flex, Card, Title, Text } from "@mantine/core";

export type SeriesCardProps = {
  recurringPlanStartDate: Date | null;
  recurringPlanEndDate: Date | null;
  recurringMonth: number | undefined;
  recurringPlanValue: number | undefined;
  recurringPlanPaymentType: string;
};

export const SeriesInputViewCard: React.FC<SeriesCardProps> = (
  props: SeriesCardProps
) => {
  const {
    recurringMonth,
    recurringPlanEndDate,
    recurringPlanStartDate,
    recurringPlanValue,
    recurringPlanPaymentType,
  } = props;

  return (
    <Card.Section inheritPadding py="md">
      <Title order={5}>Recurring Payment Plan Values</Title>
      <Flex
        direction={"row"}
        sx={(theme) => ({
          columnGap: theme.spacing.xl * 2.5,
          paddingTop: theme.spacing.sm,
        })}
      >
        {" "}
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>start date:</Title>
          <Text>{recurringPlanStartDate?.toDateString()}</Text>
        </Flex>
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>end date:</Title>
          <Text>{recurringPlanEndDate?.toDateString()}</Text>
        </Flex>
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>payment type:</Title>
          <Text>{recurringPlanPaymentType}</Text>
        </Flex>
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>recurring month:</Title>
          <Text>{recurringMonth}</Text>
        </Flex>
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>payment value:</Title>
          <Text>{recurringPlanValue}</Text>
        </Flex>
      </Flex>
    </Card.Section>
  );
};
