import { HousingScheme } from "@prisma/client";
import { PlotsSelectFields } from "@/pages/api/housingScheme";
import { PlotDetail } from "@/pages/api/housingScheme/[housingSchemeId]/plot/[id]";
import { CustomerSelectFields } from "@/pages/api/customers";
import { PaymentStatusByPlot } from "@/pages/api/housingScheme/[housingSchemeId]/payments";
import { TableRowItem } from "../components/PlotIdPage/AddPaymentForm/PaymentInputTable";
import { PostReturnType } from "@/pages/api/payments";
import { NotSoldPlotsSelectFields } from "@/pages/api/housingScheme/[housingSchemeId]/plot";
import { refundPlotData } from "@/pages/api/housingScheme/[housingSchemeId]/plot/refunds";

export const listHousingScheme = async () => {
  const response = await fetch(`/api/housingScheme`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: HousingScheme[] = await response.json();
  return res;
};

export const listPlotsByHousingSchemeId = async (id: string) => {
  const response = await fetch(`/api/housingScheme/${id}`, {
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

export const listPaymentsByHousingSchemeId = async (
  housingSchemeId: string
) => {
  const response = await fetch(
    `/api/housingScheme/${housingSchemeId}/payments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PaymentStatusByPlot = await response.json();
  return res;
};

export const getPlotByHousingSchemeIdAndPlotId = async (
  housingSchemeId: string,
  plotId: string
) => {
  if (!plotId) throw new Error("please provide valid Id");
  const response = await fetch(
    `/api/housingScheme/${housingSchemeId}/plot/${plotId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PlotDetail = await response.json();

  return res;
};

export const editPaymentStatus = async (refundPayments: string[]) => {
  const response = await fetch(`/api/payments/refunds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refundPayments: refundPayments }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const createPayment = async (data: {
  payment: TableRowItem[];
  saleId: number;
}) => {
  const response = await fetch(`/api/payments`, {
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

export const deletePayment = async (paymentId: number) => {
  const response = await fetch(`/api/payments/delete`, {
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

export const listNotSoldPlotsByHousingSchemeId = async (
  housingSchemeId: string,
  sold: number
) => {
  const response = await fetch(
    `/api/housingScheme/${housingSchemeId}/plot?sold=${sold}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: NotSoldPlotsSelectFields[] = await response.json();
  return res;
};

export const listCustomers = async () => {
  const response = await fetch(`/api/customers`, {
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

export const createSalePlot = async (data: any) => {
  const housingSchemeId = data.housingSchemeId;
  const response = await fetch(`/api/housingScheme/${housingSchemeId}/plot`, {
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

export const editSalePlot = async (data: any) => {
  const housingSchemeId = data.housingSchemeId;
  const response = await fetch(
    `/api/housingScheme/${housingSchemeId}/plot/edit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const cancelPlotSale = async (data: {
  saleId: number;
  refundPayments: string[];
  housingSchemeId: string;
}) => {
  const { saleId, refundPayments, housingSchemeId } = data;
  const response = await fetch(
    `/api/housingScheme/${housingSchemeId}/plot/refunds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ saleId: saleId, refundPayments: refundPayments }),
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: PostReturnType = await response.json();
  return res;
};

export const listPlotRefundsByHousingSchemeId = async (
  housingSchemeId: string
) => {
  const response = await fetch(
    `/api/housingScheme/${housingSchemeId}/plot/refunds`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: { data: refundPlotData[] } = await response.json();
  return res;
};
