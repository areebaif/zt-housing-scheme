import * as React from "react";
// Hook Imports
import { useQuery } from "@tanstack/react-query";
import { Card, Title, Loader } from "@mantine/core";
import { Plot } from "@prisma/client";
import { fetchNotSoldPlots } from "@/r-query/functions";
import { AllPlotId } from "../../PlotUpsertForm";
import { PlotIdInputTable } from "./PlotIdInputTable";
import { PlotDetailEditCard } from "./PlotDetailsEditCard";

type PlotDetailsInputCardProps = {
  plot: Plot[];
  isEditForm: boolean;
  allPlotSale: AllPlotId[];
  setAllPlotSale: (val: AllPlotId[]) => void;
  showForm: boolean;
  isEditPlotIdDetail: boolean;
  setIsEditPlotIdDetail: (val: boolean) => void;
};
export const PlotDetailsInputCard: React.FC<PlotDetailsInputCardProps> = (
  props
) => {
  const {
    plot,
    isEditForm,
    allPlotSale,
    setAllPlotSale,
    showForm,
    isEditPlotIdDetail,
    setIsEditPlotIdDetail,
  } = props;
  const [isEditFlag, setIsEditFlag] = React.useState(isEditForm);

  const fetchPlots = useQuery(["notSoldPlots"], fetchNotSoldPlots, {
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: showForm,
  });
  if (fetchPlots.isLoading) {
    return <Loader />;
  }

  if (fetchPlots.isError) {
    return <span>Error: error occured</span>;
  }
  const plotIdInputData = {
    plot,
    allPlotSale,
    setAllPlotSale,
    notSoldPlots: fetchPlots.data,
    setIsEditFlag,
  };

  const plotEditDetails = {
    plot,
    setIsEditFlag,
    setAllPlotSale,
    isEditPlotIdDetail,
    setIsEditPlotIdDetail,
  };
  return isEditFlag ? (
    <PlotDetailEditCard {...plotEditDetails} />
  ) : (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Plot Details</Title>
      </Card.Section>
      <PlotIdInputTable {...plotIdInputData} />
    </Card>
  );
};
