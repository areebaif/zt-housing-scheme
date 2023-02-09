import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentStatus } from "@/r-query/functions";
import { Table, Card, Loader } from "@mantine/core";
import { compare } from "@/utilities";

const PaymentStatus: React.FC = () => {
  const fetchStatus = useQuery(["upcomingPayments"], fetchPaymentStatus, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (fetchStatus.isLoading) {
    return <Loader />;
  }
  // TODO: date comapre sql
  // select * from Payment_Plan where Date(payment_date) < '2023-02-05T16:58:16.132Z';
  if (fetchStatus.isError) {
    return <span>Error: error occured</span>;
  }

  const payments = fetchStatus.data;

  const paymentPlanRows = payments.paymentStatus?.map((element) => {
    const date = new Date(`${element.payment_date}`);
    const status = compare(element.payment_date);
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
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
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
      </Card.Section>
    </Card>
  );
};

export default PaymentStatus;
