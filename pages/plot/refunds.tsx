import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchRefundSummary } from "@/r-query/functions";
import { Loader } from "@mantine/core";

export const RefundSummary: React.FC = () => {
  const { data: session, status } = useSession({
    required: true,
  });

  const fetchRefundStatus = useQuery(["refundSummary"], fetchRefundSummary, {
    enabled: status === "authenticated",
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (fetchRefundStatus.isLoading) {
    return <Loader />;
  }

  if (fetchRefundStatus.isError) {
    return <span>Error: error occured</span>;
  }
  const refundSummary = fetchRefundStatus.data;
  console.log(refundSummary);
  return <div>Hello I navigated</div>;
};

export default RefundSummary;
