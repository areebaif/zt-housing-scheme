import * as React from "react";
import { useRouter } from "next/router";
// Hook Imports
import { useQuery } from "@tanstack/react-query";
import { Card, Title, Loader } from "@mantine/core";
import { Plot } from "@prisma/client";
import { listNotSoldPlotsByHousingSchemeId } from "@/r-query/functions";
import { AllPlotId } from "../../PlotUpsertForm";
import { PlotIdInputTable } from "./PlotIdInputTable";
import { PlotDetailEditCard } from "./PlotDetailsEditCard";
import { NotSoldPlotsSelectFields } from "@/pages/api/housingScheme/[housingSchemeId]/plot";

type PlotDetailsInputCardProps = {
  plot: Plot[];
  isEditForm: boolean;
  allPlotSale: AllPlotId[];
  setAllPlotSale: (val: AllPlotId[]) => void;
  showForm: boolean;
  isEditPlotIdDetail: boolean;
  setIsEditPlotIdDetail: (val: boolean) => void;
  sellPrice: number | undefined;
  setSellPrice: (val: number | undefined) => void;
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
    sellPrice,
    setSellPrice,
  } = props;
  const router = useRouter();
  const housingSchemeId = router.query?.housingSchemeId as string;
  const [isEditFlag, setIsEditFlag] = React.useState(isEditForm);
  const [notSoldPlots, setNotSoldPlots] = React.useState<
    NotSoldPlotsSelectFields[]
  >([]);

  const fetchPlots = useQuery(
    ["notSoldPlots", [housingSchemeId, 0]],
    () => listNotSoldPlotsByHousingSchemeId(housingSchemeId, 0),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: showForm,
    }
  );
  const plots = fetchPlots.data;
  React.useEffect(() => {
    if (plots?.length) {
      setNotSoldPlots(plots);
    }
  }, [plots]);

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
    setNotSoldPlots,
    notSoldPlots,
    setIsEditFlag,
    sellPrice,
    setSellPrice,
  };

  const plotEditDetails = {
    plot,
    setIsEditFlag,
    setAllPlotSale,
    isEditPlotIdDetail,
    setNotSoldPlots,
    notSoldPlots,
    setIsEditPlotIdDetail,
    sellPrice,
    setSellPrice,
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
      {notSoldPlots.length ? (
        <PlotIdInputTable {...plotIdInputData} />
      ) : undefined}
    </Card>
  );
};
