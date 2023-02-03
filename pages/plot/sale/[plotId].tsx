import * as React from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import * as ReactQuery from "@tanstack/react-query";
import { IconChevronDown } from "@tabler/icons";
import {
  Box,
  TextInput,
  Group,
  NumberInput,
  Flex,
  Text,
  Table,
  Select,
  Autocomplete,
  Button,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { fetchAllCustomers } from "@/r-query/functions";

const NewPlot = () => {
  const router = useRouter();
  const query = router.query;
  const [plotId, setPlotId] = React.useState("");
  const [dimension, setDimension] = React.useState("");
  const [squareFeet, setSquareFeet] = React.useState("");
  const [sellPrice, setSellPrice] = React.useState<number | undefined>(
    undefined
  );
  const [sellDate, setSellDate] = React.useState<Date | null>(null);
  const [newCustomerName, setNewCustomerName] = React.useState("");
  const [sonOf, setSonOf] = React.useState("");
  const [newCustomerCNIC, setNewCustomerCNIC] = React.useState("");
  const [fixedPaymentPlan, setFixedPaymentPlan] = React.useState<any[]>([]);
  const [existingCustomerBackendData, setExistingCustomerBackendData] =
    React.useState<{ id: number; cnic: string; value: string }[]>([]);
  const [existingCustomerUserSelect, setExisitngCustomerUserSelect] =
    React.useState("");
  const [paymentPlanDateItem, setPaymentPlanDateItem] =
    React.useState<Date | null>(null);
  const [paymentPlanValueItem, setPaymentPlanValueItem] = React.useState<
    number | undefined
  >(undefined);
  const [recurringPaymentPlan, setRecurringPaymentPlane] = React.useState<
    string | undefined
  >(undefined);

  const fetchCustomers = ReactQuery.useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => fetchAllCustomers(),
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  if (fetchCustomers.isLoading) {
    // TODO: loading component
    console.log("loading");
    return <span>Loading...</span>;
  }

  if (fetchCustomers.isError) {
    return <span>Error: error occured</span>;
  }
  // Set local state data if it does not exist
  const data = fetchCustomers.data!;

  if (!existingCustomerBackendData.length) {
    setExistingCustomerBackendData(data);
  }
  if (query.plotId) {
    const plot = query.plotId as string;
    const dimension = query.dimension as string;
    const squareFeet = query.squareFeet as string;
    if (!plotId.length) {
      setPlotId(plot);
      setDimension(dimension);
      setSquareFeet(squareFeet);
    }
  }

  const onRowDelete = (key: number) => {
    console.log(key, "key");
    let paymentPlanDelete = [];
    if (fixedPaymentPlan.length) {
      paymentPlanDelete = fixedPaymentPlan.filter(
        (item, index) => index !== key - 1
      );
    }
    setFixedPaymentPlan(paymentPlanDelete);
  };

  const onAddRow = () => {
    const paymentPlanAdd = [];
    if (fixedPaymentPlan.length) {
      fixedPaymentPlan.forEach((item) => paymentPlanAdd.push(item));
    }
    const key = fixedPaymentPlan?.length + 1;
    const date = new Date(`${paymentPlanDateItem}`);
    const dateString = date.toDateString();

    paymentPlanAdd.push(
      <tr key={key}>
        <td>{dateString}</td>
        <td>{paymentPlanValueItem}</td>
        <td>
          <Button variant="outline" onClick={() => onRowDelete(key)}>
            Delete
          </Button>
        </td>
      </tr>
    );
    setFixedPaymentPlan(paymentPlanAdd);
    setPaymentPlanValueItem(undefined);
    setPaymentPlanDateItem(null);
  };

  const onSubmitForm = () => {
    // plotId: ploId
    // sell: sell Price Sell Date
    // customer:Customer Name/ son of/ CNIC OR existing Customer
    // payment plan: either fixed or recurring payment plan
    // validation of each
  };
  return router.query.plotId ? (
    <React.Fragment>
      <Text td="underline">Plot Details</Text>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <TextInput
          value={plotId}
          onChange={(event) => setPlotId(event.currentTarget.value)}
          withAsterisk
          label="Plot Number"
          placeholder="plot number"
        />
        <TextInput
          value={squareFeet}
          onChange={(event) => setSquareFeet(event.currentTarget.value)}
          label="Square ft"
          placeholder="square ft"
        />
        <TextInput
          value={dimension}
          label="Dimension"
          onChange={(event) => setDimension(event.currentTarget.value)}
          placeholder="dimension"
        />
      </Flex>
      <Text td="underline">Sell Detail</Text>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <NumberInput
          label="Sell Price"
          value={sellPrice}
          placeholder={"enter sold value"}
          withAsterisk
          onChange={(val) => setSellPrice(val)}
          parser={(sellPrice) => sellPrice?.replace(/\$\s?|(,*)/g, "")}
          error={
            sellPrice ? (sellPrice < 1 ? "enter values above 0" : false) : true
          }
          formatter={(value) => {
            return value
              ? !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
              : "";
          }}
        />
        <DatePicker
          inputFormat="DD/MM/YYYY"
          label={"select date"}
          placeholder={"dd/mm/yyyy"}
          withAsterisk
          error={!sellDate}
          value={sellDate}
          onChange={setSellDate}
        />
      </Flex>
      <Text td="underline">Customer Details</Text>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <Autocomplete
          label="exisitng customer cnic no"
          placeholder="Start typing to see exisitng customer cnic no"
          value={existingCustomerUserSelect}
          onChange={setExisitngCustomerUserSelect}
          data={
            existingCustomerUserSelect.length
              ? existingCustomerBackendData
                ? existingCustomerBackendData
                : []
              : []
          }
        />
        <Box sx={(theme) => ({ padding: theme.spacing.lg })}>
          <Text>or</Text>
        </Box>
        <TextInput
          value={newCustomerName}
          onChange={(event) => setNewCustomerName(event.currentTarget.value)}
          label="customer name"
          placeholder="name"
        />
        <TextInput
          value={sonOf}
          onChange={(event) => setSonOf(event.currentTarget.value)}
          label="son/of"
          placeholder="son/of"
        />
        <TextInput
          value={newCustomerCNIC}
          onChange={(event) => setNewCustomerCNIC(event.currentTarget.value)}
          label="cnic no"
          placeholder="cnic no"
        />
      </Flex>
      <Text td="underline">Payment Plan</Text>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <TextInput
          value={recurringPaymentPlan}
          onChange={(event) =>
            setRecurringPaymentPlane(event.currentTarget.value)
          }
          label="recurring payment plan"
          placeholder="enter value in days"
        />
        <Box sx={(theme) => ({ padding: theme.spacing.lg })}>
          <Text>or</Text>
        </Box>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th colSpan={3}>
                <Text align="center">fixed payment plan</Text>
              </th>
            </tr>
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th>Add or Delete Values</th>
            </tr>
          </thead>
          <tbody>
            {fixedPaymentPlan}
            <tr>
              <td>
                <DatePicker
                  inputFormat="DD/MM/YYYY"
                  label={"select date"}
                  placeholder={"dd/mm/yyyy"}
                  withAsterisk
                  value={paymentPlanDateItem}
                  onChange={setPaymentPlanDateItem}
                />
              </td>
              <td>
                <NumberInput
                  label="payment value"
                  value={paymentPlanValueItem}
                  withAsterisk
                  placeholder={"enter value to be collected"}
                  onChange={(val) => setPaymentPlanValueItem(val)}
                  parser={(sellPrice) => sellPrice?.replace(/\$\s?|(,*)/g, "")}
                  error={
                    paymentPlanValueItem
                      ? paymentPlanValueItem < 0
                        ? "enter values above 0"
                        : false
                      : false
                  }
                  formatter={(value) => {
                    return value
                      ? !Number.isNaN(parseFloat(value))
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                      : "";
                  }}
                />
              </td>
              <td>
                {
                  <Button variant="outline" onClick={onAddRow}>
                    Add Values
                  </Button>
                }
              </td>
            </tr>
          </tbody>
        </Table>
      </Flex>
      <Group position="right">
        <Button onClick={onSubmitForm} variant="outline">
          Submit
        </Button>
      </Group>
    </React.Fragment>
  ) : (
    <div>loading</div>
  );
};

export default NewPlot;
