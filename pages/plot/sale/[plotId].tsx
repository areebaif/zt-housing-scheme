import * as React from "react";
import { useRouter } from "next/router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  Box,
  Card,
  TextInput,
  Group,
  NumberInput,
  Flex,
  Text,
  Autocomplete,
  Button,
  Title,
  Loader,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { fetchAllCustomers, postAddPlotSale } from "@/r-query/functions";
import {
  UpsertTableRows,
  TableRowItem,
} from "../../../components/TableRowsUpsert";
import { PaymentInput } from "@/components/PaymentInput";
import { formatAddTime } from "@/utilities";
import { CustomerSelectFields } from "@/pages/api/customer/all";

export interface FormPostProps {
  plotId: string;
  sellPrice: number;
  soldDateString: string;
  downPayment: number;
  developmentCharges: number | undefined;
  customer: {
    customerCNIC: string;
    customerName: string;
    sonOf: string;
    newCustomer: boolean;
  };
  paymentPlan: TableRowItem[];
}

// TODO: show development Charges in Payment Plan when are they collected????

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
  const [developmentChargePercent, setDevelopmentChargePercent] =
    React.useState<number | undefined>(undefined);
  const [sellDate, setSellDate] = React.useState<Date | null>(null);
  // new customer props
  const [customerName, setCustomerName] = React.useState("");
  const [sonOf, setSonOf] = React.useState("");
  const [customerCNIC, setCustomerCNIC] = React.useState("");
  //existing customer props
  const [existingCustomerBackendData, setExistingCustomerBackendData] =
    React.useState<CustomerSelectFields[] | undefined>([]);

  const [isNewCustomer, setIsNewCustomer] = React.useState(false);

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

    //customer data fields validation
    if (!customerCNIC) throw new Error("Please enter cnic");
    if (isNewCustomer && (!customerName || !customerCNIC || !sonOf))
      throw new Error("please enter customer name son of and cnic");
    // payment plan fields validation
    if (!tableRows.length)
      throw new Error("please enter a payment plan for customer");
    // format date

    const soldDateString = formatAddTime(`${sellDate}`);

    const data: FormPostProps = {
      plotId,
      sellPrice,
      soldDateString,
      downPayment,
      developmentCharges,
      customer: {
        customerCNIC,
        customerName,
        sonOf,
        newCustomer: isNewCustomer,
      },
      paymentPlan: tableRows,
    };
    console.log(data);
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

  if (fetchCustomers.isLoading || mutation.isLoading) {
    // TODO: loading component
    return <Loader />;
  }

  if (fetchCustomers.isError) {
    return <Loader />;
  }
  // this has to remain outside useEffect otherwise throws error

  const plotDetailsData = {
    plotId,
    setPlotId,
    dimension,
    setDimension,
    squareFeet,
    setSquareFeet,
  };
  const sellDetailsData = {
    sellDate,
    setSellDate,
    sellPrice,
    setSellPrice,
    downPayment,
    setDownPayment,
    developmentCharges,
    setDevelopmentCharges,
    developmentChargePercent,
    setDevelopmentChargePercent,
  };
  const customerDetailsData = {
    customerCNIC,
    setCustomerCNIC,
    existingCustomerBackendData,
    customerName,
    setCustomerName,
    sonOf,
    setSonOf,
    isNewCustomer,
    setIsNewCustomer,
  };

  return router.query.plotId ? (
    <React.Fragment>
      <PlotDetailsInput {...plotDetailsData} />
      <SellDetailsInput {...sellDetailsData} />
      <CustomerDetailsInput {...customerDetailsData} />
      <PaymentInput
        tableRows={tableRows}
        setTableRows={setTableRows}
        descriptionField={"Payment Plan"}
      />
      <Group position="center" style={{ margin: "15px 0 0 0" }}>
        <Button size="xl" onClick={onSubmitForm}>
          Submit
        </Button>
      </Group>
    </React.Fragment>
  ) : (
    <div>loading</div>
  );
};

type PlotDetailsInputProps = {
  plotId: string;
  setPlotId: (plotId: string) => void;
  squareFeet: string;
  setSquareFeet: (sqFeet: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
};
const PlotDetailsInput: React.FC<PlotDetailsInputProps> = (props) => {
  const {
    plotId,
    //setPlotId,
    squareFeet,
    //setSquareFeet,
    dimension,
    //setDimension,
  } = props;
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Plot Details</Title>
      </Card.Section>
      <Card.Section inheritPadding py="md">
        <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
          <TextInput
            value={plotId}
            //onChange={(event) => setPlotId(event.currentTarget.value)}
            withAsterisk
            error={
              isNaN(parseInt(plotId)) ? "please enter a valid plot number" : ""
            }
            label="plot number"
            placeholder="plot number"
            disabled={true}
          />
          <TextInput
            value={squareFeet}
            //onChange={(event) => setSquareFeet(event.currentTarget.value)}
            error={
              isNaN(parseInt(squareFeet))
                ? "please enter a valid dimension"
                : ""
            }
            label="square ft"
            placeholder="square ft"
            disabled={true}
          />
          <TextInput
            value={dimension}
            label="dimension"
            //onChange={(event) => setDimension(event.currentTarget.value)}
            placeholder="dimension"
            disabled={true}
          />
        </Flex>
      </Card.Section>
    </Card>
  );
};

type SellDetailsInputProps = {
  sellDate: Date | null;
  setSellDate: (val: Date | null) => void;
  sellPrice: number | undefined;
  setSellPrice: (price: number | undefined) => void;
  downPayment: number | undefined;
  setDownPayment: (payment: number | undefined) => void;
  developmentCharges: number | undefined;
  setDevelopmentCharges: (charges: number | undefined) => void;
  developmentChargePercent: number | undefined;
  setDevelopmentChargePercent: (charges: number | undefined) => void;
};
const SellDetailsInput: React.FC<SellDetailsInputProps> = (props) => {
  const {
    sellDate,
    setSellDate,
    sellPrice,
    setSellPrice,
    downPayment,
    setDownPayment,
    developmentCharges,
    setDevelopmentCharges,
    developmentChargePercent,
    setDevelopmentChargePercent,
  } = props;
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Sell Detail</Title>
      </Card.Section>
      <Card.Section inheritPadding py="md">
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
            label="sell price"
            value={sellPrice}
            placeholder={"enter sold value"}
            withAsterisk
            onChange={(val) => setSellPrice(val)}
            parser={(sellPrice) => sellPrice?.replace(/\$\s?|(,*)/g, "")}
            error={
              sellPrice
                ? sellPrice < 1
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
            label="down payment"
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
            label="development charges (% of sell price)"
            value={developmentChargePercent}
            placeholder={"enter value between 0 and 100"}
            onChange={(val) => setDevelopmentChargePercent(val)}
            parser={(developmentCharges) =>
              developmentCharges?.replace(/\$\s?|(,*)/g, "")
            }
            error={
              developmentChargePercent
                ? developmentChargePercent < 0 || developmentChargePercent > 100
                  ? "enter values between 0 and 100"
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
          <NumberInput
            label="development charges (pkr)"
            value={
              developmentChargePercent && sellPrice
                ? (developmentChargePercent / 100) * sellPrice
                : 0
            }
            placeholder={
              developmentCharges === 0 ? "enter sell price and % for value" : ""
            }
            // onChange={(val) => {
            //   const value =
            //     developmentChargePercent && sellPrice
            //       ? developmentChargePercent * sellPrice
            //       : 0;
            //   setDevelopmentCharges(value);
            // }}
            disabled={true}
            parser={(developmentCharges) =>
              developmentCharges?.replace(/\$\s?|(,*)/g, "")
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
      </Card.Section>
    </Card>
  );
};

type CustomerDetailsInputProps = {
  customerCNIC: string;
  setCustomerCNIC: (val: string) => void;
  existingCustomerBackendData: CustomerSelectFields[] | undefined;
  customerName: string;
  setCustomerName: (val: string) => void;
  sonOf: string;
  setSonOf: (val: string) => void;
  isNewCustomer: boolean;
  setIsNewCustomer: (val: boolean) => void;
};
const CustomerDetailsInput: React.FC<CustomerDetailsInputProps> = (props) => {
  const {
    customerCNIC,
    setCustomerCNIC,
    existingCustomerBackendData,
    customerName,
    setCustomerName,
    sonOf,
    setSonOf,
    isNewCustomer,
    setIsNewCustomer,
  } = props;

  const [showCustomerFields, setShowCustomerFields] = React.useState(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      FindExistingCustomerSetValues();
    }
  };

  const FindExistingCustomerSetValues = () => {
    const exisitngCustomer = existingCustomerBackendData?.filter(
      (item) => item.value === customerCNIC
    );

    if (exisitngCustomer?.length) {
      setCustomerName(exisitngCustomer[0].name);
      setSonOf(exisitngCustomer[0].son_of ? exisitngCustomer[0].son_of : "");
      setShowCustomerFields(true);
    } else {
      setIsNewCustomer(true);
      setShowCustomerFields(true);
    }
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Customer Details</Title>
      </Card.Section>
      <Card.Section inheritPadding py="md">
        <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
          {!showCustomerFields ? (
            <Flex
              direction="row"
              align="flex-start"
              gap="md"
              justify="flex-start"
            >
              <TextInput
                label="CNIC Number: Type to search existing customer cnic or add a new customer"
                placeholder="CNIC"
                value={customerCNIC}
                onChange={(event) => setCustomerCNIC(event.currentTarget.value)}
                onKeyDown={(e) => onKeyDown(e)}
              />
              <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
                <Button
                  variant="outline"
                  onClick={() => {
                    FindExistingCustomerSetValues();
                  }}
                >
                  Search
                </Button>
              </Box>
            </Flex>
          ) : (
            <Flex
              direction="row"
              align="flex-start"
              gap="md"
              justify="flex-start"
            >
              <TextInput
                value={customerName}
                label="customer name"
                placeholder="name"
                onChange={(event) => setCustomerName(event.currentTarget.value)}
                disabled={!isNewCustomer}
              />
              <TextInput
                value={sonOf ? sonOf : ""}
                label="son/of"
                placeholder="son of"
                onChange={(event) => setSonOf(event.currentTarget.value)}
                disabled={!isNewCustomer}
              />{" "}
              <TextInput
                value={customerCNIC}
                onChange={(event) => {
                  setCustomerCNIC(event.currentTarget.value);
                }}
                label="cnic no"
                placeholder="cnic no"
                disabled={!isNewCustomer}
              />
              <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
                <Button
                  onClick={() => {
                    setShowCustomerFields(false);
                    setCustomerName("");
                    setSonOf("");
                    setIsNewCustomer(false);
                  }}
                >
                  Back
                </Button>
              </Box>
            </Flex>
          )}
        </Flex>
      </Card.Section>
    </Card>
  );
};

export default NewPlot;
