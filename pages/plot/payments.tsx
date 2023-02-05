import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { upComingPayments } from "@/r-query/functions";
import { PaymentPlanTable } from "./[id]";
import { Group, Table, Text, Divider, Flex, Button } from "@mantine/core";
import { compare } from "../../utilities/index";

const paymentStatus: React.FC = () => {
  const fetchUpcomingPayments = useQuery(
    ["upcomingPayments"],
    upComingPayments,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  if (fetchUpcomingPayments.isLoading) {
    // TODO: loading component
    console.log("loading");
    return <span>Loading...</span>;
  }
  // TODO: date comapre sql
  // select * from Payment_Plan where Date(payment_date) < '2023-02-05T16:58:16.132Z';
  if (fetchUpcomingPayments.isError) {
    return <span>Error: error occured</span>;
  }

  const upcomingPayments = fetchUpcomingPayments.data;

  const paymentPlanRows = upcomingPayments.upcomingPayments?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    const compareDate = date.toISOString();
    const status = compare(compareDate);
    return (
      <tr key={element.id}>
        <td>{element.plot_id}</td>
        <td>{element.name}</td>
        <td>{element.son_of}</td>
        <td>{element.paymentStatus}</td>
        <td>{date.toDateString()}</td>

        <td>
          {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
        <td>{status}</td>
      </tr>
    );
  });

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Plot Number</th>
          <th>Customer Name</th>
          <th>Son/ of</th>
          <th>payment status</th>
          <th>Estimated Payment Date</th>
          <th>Estimated Payment Value</th>
        </tr>
      </thead>
      <tbody>{paymentPlanRows}</tbody>
    </Table>
  );
};

export default paymentStatus;
