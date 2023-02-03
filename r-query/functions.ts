import { Plot, Status, Customer, Payments, Payment_Plan } from "@prisma/client";
import { PlotsSelectFields } from "../pages/api/plot/all";
import { PlotDetail } from "../pages/api/plot/[id]";
import { CustomerSelectFields } from "@/pages/api/customer/all";

export const fetchAllPlots = async () => {
  const response = await fetch("/api/plot/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: PlotsSelectFields[] = await response.json();
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

export const fetchAllCustomers = async () => {
  const response = await fetch(`/api/customer/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: CustomerSelectFields[] = await response.json();
  return res;
};
