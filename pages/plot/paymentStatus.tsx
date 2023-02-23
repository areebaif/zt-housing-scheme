import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPaymentStatus } from "@/r-query/functions";
import {
  Table,
  Card,
  Loader,
  Title,
  Slider,
  Flex,
  Group,
  NumberInput,
} from "@mantine/core";
import { compare, beforeDateInput } from "@/utilities";
import { PaymentStatusBySaleIdCustomerId } from "../api/payment/paymentStatus";

const PaymentStatus: React.FC = () => {
  // const { status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     signIn("google");
  //   },
  // });
  const [numberInput, setNumberInput] = React.useState(40);
  const fetchStatus = useQuery(["upcomingPayments"], fetchPaymentStatus, {
    // enabled: status === "authenticated",
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (fetchStatus.isLoading) {
    return <Loader />;
  }

  if (fetchStatus.isError) {
    return <span>Error: error occured</span>;
  }

  const onChangeNumberInput = (val: number | undefined) => {
    console.log(val, "hua");
    if (!val) {
      setNumberInput(0);
    } else {
      setNumberInput(val);
    }
  };

  const payments = fetchStatus.data;
  const latePayments: PaymentStatusBySaleIdCustomerId[] = [];
  const mappedUpcomingPayments: PaymentStatusBySaleIdCustomerId[] = [];

  payments.paymentStatus?.forEach((element) => {
    const status = compare(element.payment_date);
    status === "late"
      ? latePayments.push(element)
      : mappedUpcomingPayments.push(element);
  });

  const result = mappedUpcomingPayments.filter((element) => {
    return beforeDateInput(element.payment_date, numberInput);
  });

  return (
    <React.Fragment>
      <PaymentStatusTable
        tableRows={latePayments}
        tableHead={"Late Payments"}
      />

      <PaymentStatusTable
        tableRows={result}
        tableHead={"Upcoming Payments"}
        numberInput={numberInput}
        onChangeNumberInput={onChangeNumberInput}
      />
    </React.Fragment>
  );
};
type PaymentStatusTableProps = {
  tableRows: PaymentStatusBySaleIdCustomerId[];
  tableHead: string;
  numberInput?: number;
  onChangeNumberInput?: (val: number | undefined) => void;
};
export const PaymentStatusTable: React.FC<PaymentStatusTableProps> = (
  props: PaymentStatusTableProps
) => {
  const { tableRows, tableHead, numberInput, onChangeNumberInput } = props;

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
          {tableHead === "Upcoming Payments" && (
            <DayFilter
              numberInput={numberInput}
              setNumberInput={(e) => {
                onChangeNumberInput ? onChangeNumberInput(e) : undefined;
              }}
            />
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
          <tbody>
            {tableRows.map((element) => {
              const date = new Date(`${element.payment_date}`);
              return (
                <tr key={element.id}>
                  <td>{element.plot_id}</td>
                  <td>{element.name}</td>
                  <td>{element.son_of}</td>
                  <td>{date.toDateString()}</td>
                  <td>
                    {`${element.payment_value}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                  <td>{element.payment_type}</td>
                  <td>
                    {element.paymentValueStatus === "not paid" ? "no" : "yes"}
                  </td>
                  <td>
                    {`${element.paymentCollectionValue}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Section>
    </Card>
  );
};

type MarkedSliderProps = {
  numberInput: number | undefined;
  setNumberInput: (val: number | undefined) => void;
};

const DayFilter: React.FC<MarkedSliderProps> = (props: MarkedSliderProps) => {
  const { numberInput, setNumberInput } = props;

  return (
    <NumberInput
      value={numberInput}
      onChange={setNumberInput}
      error={
        numberInput ? (numberInput < 1 ? "enter values above 0" : false) : false
      }
      label={`payment collection for next ${numberInput} days`}
      parser={(numberInput) => numberInput?.replace(/\$\s?|(,*)/g, "")}
      formatter={(value) =>
        !Number.isNaN(parseFloat(value ? value : ""))
          ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
          : ""
      }
    />
  );
};

export default PaymentStatus;
