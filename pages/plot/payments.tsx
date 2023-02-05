import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { upComingPayments } from "@/r-query/functions";

const paymentStatus: React.FC = () => {
//   const fetchUpcomingPayments = useQuery(
//     ["upcomingPayments"],
//     upComingPayments,
//     {
//       staleTime: Infinity,
//       cacheTime: Infinity,
//     }
//   );
//   if (fetchUpcomingPayments.isLoading) {
//     // TODO: loading component
//     console.log("loading");
//     return <span>Loading...</span>;
//   }

//   if (fetchUpcomingPayments.isError) {
//     return <span>Error: error occured</span>;
//   }

//   const upcomingPayments = fetchUpcomingPayments.data;

  return <div>Hello</div>;
};

export default paymentStatus;
