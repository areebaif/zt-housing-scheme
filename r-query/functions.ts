import { Status, Plot } from "@prisma/client";

export const fetchAllPlots = async () => {
  const response = await fetch("/api/allPlots", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: Plot[] = await response.json();
  return res;
};
