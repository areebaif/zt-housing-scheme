import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchPaymentStatus } from "@/r-query/functions";
import { Table, Card, Loader, Title, Slider, Flex, Group } from "@mantine/core";
import { compare, beforeDateInput } from "@/utilities";
import { PaymentSchedule } from "../api/payment/paymentStatus";

const PaymentStatus: React.FC = () => {
  const { status } = useSession({
    required: true,
  });
  const [sliderValue, setSliderValue] = React.useState(40);
  const fetchStatus = useQuery(["upcomingPayments"], fetchPaymentStatus, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (fetchStatus.isLoading || status === "loading") {
    return <Loader />;
  }

  if (fetchStatus.isError) {
    return <span>Error: error occured</span>;
  }

  const payments = fetchStatus.data;
  const latePayments: JSX.Element[] = [];
  const upcomingPayments: JSX.Element[] = [];
  const mappedUpcomingPayments: PaymentSchedule[] = [];

  payments.paymentStatus?.forEach((element) => {
    const date = new Date(`${element.payment_date}`);
    const status = compare(element.payment_date);
    const jsxElement = (
      <tr key={element.id}>
        <td>{element.plot_id}</td>
        <td>{element.name}</td>
        <td>{element.son_of}</td>
        <td>{date.toDateString()}</td>
        <td>
          {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
        <td>{element.payment_type}</td>
        <td>{element.paymentValueStatus === "not paid" ? "no" : "yes"}</td>
        <td>
          {`${element.paymentCollectionValue}`.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          )}
        </td>
      </tr>
    );

    status === "late"
      ? latePayments.push(jsxElement)
      : mappedUpcomingPayments.push(element);
  });

  mappedUpcomingPayments.filter((element) => {
    const date = new Date(`${element.payment_date}`);
    const jsxElement = (
      <tr key={element.id}>
        <td>{element.plot_id}</td>
        <td>{element.name}</td>
        <td>{element.son_of}</td>
        <td>{date.toDateString()}</td>
        <td>
          {`${element.payment_value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
        <td>{element.payment_type}</td>
        <td>{element.paymentValueStatus === "not paid" ? "no" : "yes"}</td>
        <td>
          {`${element.paymentCollectionValue}`.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          )}
        </td>
      </tr>
    );
    const result = beforeDateInput(element.payment_date, sliderValue);

    result ? upcomingPayments.push(jsxElement) : null;
  });

  return (
    <React.Fragment>
      <PaymentStatusTable
        tableRows={latePayments}
        tableHead={"Late Payments"}
      />

      <PaymentStatusTable
        tableRows={upcomingPayments}
        tableHead={"Upcoming Payments"}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
      />
    </React.Fragment>
  );
};
type PaymentStatusTableProps = {
  tableRows: JSX.Element[];
  tableHead: string;
  sliderValue?: number;
  setSliderValue?: (val: number) => void;
};
export const PaymentStatusTable: React.FC<PaymentStatusTableProps> = (
  props: PaymentStatusTableProps
) => {
  const { tableRows, tableHead, sliderValue, setSliderValue } = props;
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ margin: "25px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart" mt="md" mb="xl">
          <Title order={3}>{tableHead}</Title>
          {tableHead === "Upcoming Payments" &&
          sliderValue &&
          setSliderValue ? (
            <MarkedSlider
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
            />
          ) : (
            <></>
          )}
        </Group>
      </Card.Section>
      <Card.Section p="md">
        <Table fontSize={"md"} highlightOnHover>
          <thead>
            <tr>
              <th>plot no</th>
              <th>name</th>
              <th>son of</th>
              <th>date (payment plan)</th>
              <th>value (payment plan)</th>
              <th>payment type</th>
              <th>is payment partially paid</th>
              <th>value to be collected</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </Table>
      </Card.Section>
    </Card>
  );
};

type MarkedSliderProps = {
  sliderValue: number;
  setSliderValue: (val: number) => void;
};

const MarkedSlider: React.FC<MarkedSliderProps> = (
  props: MarkedSliderProps
) => {
  const { sliderValue, setSliderValue } = props;
  const marks = [
    { value: 0, label: "0" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
    { value: 40, label: "40" },
    { value: 50, label: "50" },
    { value: 60, label: "60" },
    { value: 70, label: "70" },
    { value: 80, label: "80" },
    { value: 90, label: "90" },
  ];
  return (
    <Flex direction="column">
      <Title
        order={5}
      >{`payment collection for next ${sliderValue} days`}</Title>
      <Slider
        max={90}
        min={1}
        marks={marks}
        value={sliderValue}
        onChange={setSliderValue}
      />
    </Flex>
  );
};

export default PaymentStatus;
