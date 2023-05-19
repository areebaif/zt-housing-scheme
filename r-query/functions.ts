import { Plot, Status, Customer, Payments, Payment_Plan } from "@prisma/client";
import { PlotsSelectFields } from "../pages/api/plot/all";
import { PlotDetail } from "../pages/api/plot/[id]";
import { CustomerSelectFields, ReturnError } from "@/pages/api/customer/all";
import { PaymentStatusByPlot } from "@/pages/api/payment/paymentStatus";
import { TableRowItem } from "../components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { PostReturnType } from "@/pages/api/payment/add";
import { NotSoldPlotsSelectFields } from "@/pages/api/plot/notSold";

export const fetchAllPlots = async () => {
  const response = await fetch("/api/plot/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PlotsSelectFields[] = await response.json();
  return res;
};

export const fetchNotSoldPlots = async () => {
  const response = await fetch("/api/plot/notSold", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: NotSoldPlotsSelectFields[] = await response.json();
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
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
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

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: CustomerSelectFields[] = await response.json();

  return res;
};

export const postAddPlotSale = async (data: any) => {
  const response = await fetch(`/api/plot/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const postEditPlotSale = async (data: any) => {
  const response = await fetch(`/api/plot/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const postPlotPayment = async (data: {
  payment: TableRowItem[];
  saleId: number;
}) => {
  const response = await fetch(`/api/payment/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const postDeletePayment = async (paymentId: number) => {
  console.log(paymentId, "holla");
  const response = await fetch(`/api/payment/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentId: paymentId }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const fetchPaymentStatus = async () => {
  const response = await fetch(`/api/payment/paymentStatus`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PaymentStatusByPlot = await response.json();
  return res;
};
