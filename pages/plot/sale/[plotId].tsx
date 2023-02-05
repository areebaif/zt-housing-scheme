import * as React from "react";
import { useRouter } from "next/router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  Box,
  TextInput,
  Group,
  NumberInput,
  Flex,
  Text,
  Autocomplete,
  Button,
} from "@mantine/core";
import dayjs from "dayjs";
import { DatePicker } from "@mantine/dates";
import { fetchAllCustomers, postAddPlotSale } from "@/r-query/functions";
import {
  UpsertTableRows,
  TableRowItem,
} from "../../../components/TableRowsUpsert";
import { formatAddTime } from "@/utilities";

const NewPlot = () => {
  const queryClient = useQueryClient();
  // router props
  const router = useRouter();
  const query = router.query;
  const routerReady = router.isReady;
  // plot metadata props
  const [plotId, setPlotId] = React.useState("");
  const [dimension, setDimension] = React.useState("");
  const [squareFeet, setSquareFeet] = React.useState("");
  // sell info props
  const [sellPrice, setSellPrice] = React.useState<number | undefined>(
    undefined
  );
  const [downPayment, setDownPayment] = React.useState<number | undefined>(
    undefined
  );
  const [developmentCharges, setDevelopmentCharges] = React.useState<
    number | undefined
  >(0);
  const [sellDate, setSellDate] = React.useState<Date | null>(null);
  // new customer props
  const [newCustomerName, setNewCustomerName] = React.useState("");
  const [sonOf, setSonOf] = React.useState("");
  const [newCustomerCNIC, setNewCustomerCNIC] = React.useState("");
  // existing customer props
  const [existingCustomerBackendData, setExistingCustomerBackendData] =
    React.useState<{ id: number; cnic: string; value: string }[] | undefined>(
      []
    );
  const [existingCustomerUserSelect, setExisitngCustomerUserSelect] =
    React.useState("");

  // table props
  const [tableRows, setTableRows] = React.useState<TableRowItem[]>([]);

  // fetch exisitng customer data from backend
  const fetchCustomers = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => fetchAllCustomers(),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: postAddPlotSale,
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.push("/");
    },
  });
  const onSubmitForm = () => {
    // plot and sell information validation
    if (!plotId || !sellDate || !sellPrice || !downPayment)
      throw new Error(
        "please provide plotNumber, Sell Date ad Sell Price to submit the form"
      );
    // customer data fields validation
    if (
      !existingCustomerUserSelect &&
      (!newCustomerName || !newCustomerCNIC || !sonOf)
    )
      throw new Error(
        "Please enter customer data: Either select an existing customer or enter information for new customer"
      );
    if (
      existingCustomerUserSelect &&
      (newCustomerName || newCustomerCNIC || sonOf)
    )
      throw new Error(
        "please select either from existing customer or add a new customer"
      );
    // payment plan fields validation
    if (!tableRows.length)
      throw new Error("please enter a payment plan for customer");
    // format date

    const soldDateString = formatAddTime(`${sellDate}`);

    const data = {
      plotId,
      sellPrice,
      soldDateString,
      downPayment,
      developmentCharges,
      customer: {
        newCustomerCNIC,
        newCustomerName,
        sonOf,
        existingCustomer: existingCustomerUserSelect,
      },
      paymentPlan: tableRows,
    };
    console.log("submit data", data);
    mutation.mutate(data);
  };

  React.useEffect(() => {
    const plot = query.plotId as string;
    const dimension = query.dimension as string;
    const squareFeet = query.squareFeet as string;
    setPlotId(plot);
    setDimension(dimension);
    setSquareFeet(squareFeet);
    setExistingCustomerBackendData(fetchCustomers.data);
  }, [routerReady, fetchCustomers.data]);
  
  if (fetchCustomers.isLoading) {
    // TODO: loading component
    return <span>Loading...</span>;
  }

  if (fetchCustomers.isError) {
    return <span>Error: error occured</span>;
  }
  // this has to remain outside useEffect otherwise throws error

  return router.query.plotId ? (
    <React.Fragment>
      <Text td="underline">Plot Details</Text>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <TextInput
          value={plotId}
          onChange={(event) => setPlotId(event.currentTarget.value)}
          withAsterisk
          error={
            isNaN(parseInt(plotId)) ? "please enter a valid plot number" : ""
          }
          label="Plot Number"
          placeholder="plot number"
        />
        <TextInput
          value={squareFeet}
          onChange={(event) => setSquareFeet(event.currentTarget.value)}
          error={
            isNaN(parseInt(squareFeet)) ? "please enter a valid dimension" : ""
          }
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
        <DatePicker
          inputFormat="ddd MMM D YYYY"
          label={"select date"}
          placeholder={"dd/mm/yyyy"}
          withAsterisk
          error={!sellDate}
          value={sellDate}
          onChange={setSellDate}
        />
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
        <NumberInput
          label="Down Payment"
          value={downPayment}
          placeholder={"enter down payment"}
          withAsterisk
          onChange={(val) => setDownPayment(val)}
          parser={(downPayment) => downPayment?.replace(/\$\s?|(,*)/g, "")}
          error={
            downPayment
              ? downPayment < 1
                ? "enter values above 0"
                : false
              : true
          }
          formatter={(value) => {
            return value
              ? !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
              : "";
          }}
        />
        <NumberInput
          label="development charges"
          value={developmentCharges}
          placeholder={"enter down payment"}
          onChange={(val) => setDevelopmentCharges(val)}
          parser={(developmentCharges) =>
            developmentCharges?.replace(/\$\s?|(,*)/g, "")
          }
          error={
            developmentCharges
              ? developmentCharges < 0
                ? "enter values 0 or more than 0"
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

      <UpsertTableRows
        tableHeader="Payment Plan"
        tableRows={tableRows}
        setTableRows={setTableRows}
      />

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
