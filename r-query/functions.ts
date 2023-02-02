import { Plot, Status, Customer, Payments } from "@prisma/client";

export interface PlotDetail {
  plot: Plot;
  customer?: Customer | null;
  payments?: Payments[];
}

export const fetchAllPlots = async () => {
  const response = await fetch("/api/plot/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: Plot[] = await response.json();
  return res;
};

export const fetchPlotById = async (id: string) => {
  if (!id) throw new Error("please provide valid Id");
  const response = await fetch(`/api/plot/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: PlotDetail = await response.json();
  return res;
};
