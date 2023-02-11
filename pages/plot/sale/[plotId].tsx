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
  Button,
  Title,
  Loader,
  Table,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { fetchAllCustomers, postAddPlotSale } from "@/r-query/functions";
import { TableRowItem } from "../../../components/TableRowsUpsert";
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

interface AddSaleFormProps {
  plotNumber: string;
  dimensionString: string;
  squareFt: string;
  soldPrice: number | undefined;
  name: string;
  son_of: string;
  cnic: string;
  soldDate: Date | null;
  futurePaymentPlan: TableRowItem[] | [];
  isEditForm: boolean;
  setIsEditForm: (val: boolean) => void;
}

const NewPlot: React.FC<AddSaleFormProps> = (props: AddSaleFormProps) => {
  const {
    plotNumber,
    dimensionString,
    squareFt,
    soldPrice,
    name,
    son_of,
    cnic,
    soldDate,
    futurePaymentPlan,
    isEditForm,
    setIsEditForm,
  } = props;
  const queryClient = useQueryClient();
  // // router props
  const router = useRouter();
  // const query = router.query;
  // const routerReady = router.isReady;
  // plot metadata props
  const [plotId, setPlotId] = React.useState(plotNumber);
  const [dimension, setDimension] = React.useState(dimensionString);
  const [squareFeet, setSquareFeet] = React.useState(squareFt);
  // sell info props
  const [sellPrice, setSellPrice] = React.useState<number | undefined>(
    soldPrice
  );
  const [downPayment, setDownPayment] = React.useState<number | undefined>(
    undefined
  );
  const [developmentCharges, setDevelopmentCharges] = React.useState<
    number | undefined
  >(0);
  const [developmentChargePercent, setDevelopmentChargePercent] =
    React.useState<number | undefined>(undefined);
  const [sellDate, setSellDate] = React.useState<Date | null>(soldDate);
  // new customer props
  const [customerName, setCustomerName] = React.useState(name);
  const [sonOf, setSonOf] = React.useState(son_of);
  const [customerCNIC, setCustomerCNIC] = React.useState(cnic);
  //existing customer props
  const [existingCustomerBackendData, setExistingCustomerBackendData] =
    React.useState<CustomerSelectFields[] | undefined>([]);
  const [isNewCustomer, setIsNewCustomer] = React.useState(false);

  // table props
  const [tableRows, setTableRows] =
    React.useState<TableRowItem[]>(futurePaymentPlan);

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
    //const plot = query.plotId as string;
    //const dimension = query.dimension as string;
    //const squareFeet = query.squareFeet as string;
    //setPlotId(plot);
    //setDimension(dimension);
    //setSquareFeet(squareFeet);
    setExistingCustomerBackendData(fetchCustomers.data);
  }, [fetchCustomers.data]);

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
    isEditForm,
  };

  return (
    <React.Fragment>
      <PlotDetailsInput {...plotDetailsData} />
      <SellDetailsInput {...sellDetailsData} />
      <CustomerDetailsInput {...customerDetailsData} />

      {!isEditForm ? (
        <PaymentInput
          tableRows={tableRows}
          setTableRows={setTableRows}
          descriptionField={"Payment Plan"}
        />
      ) : (
        <PaymentPlanView
          paymentPlan={tableRows}
          descriptionField={true}
          setTableRows={setTableRows}
          setIsEditForm={setIsEditForm}
        />
      )}

      <Group position="center" style={{ margin: "15px 0 0 0" }}>
        <Button size="xl" onClick={onSubmitForm}>
          Submit
        </Button>
      </Group>
    </React.Fragment>
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
            value={squareFeet ? squareFeet : ""}
            //onChange={(event) => setSquareFeet(event.currentTarget.value)}
            error={
              isNaN(parseInt(squareFeet ? squareFeet : ""))
                ? "please enter a valid dimension"
                : ""
            }
            label="square ft"
            placeholder="square ft"
            disabled={true}
          />
          <TextInput
            value={dimension ? dimension : ""}
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
  isEditForm: boolean;
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
    isEditForm,
  } = props;
  const [isEditFlag, setIsEditFlag] = React.useState(isEditForm);
  const [showCustomerFields, setShowCustomerFields] = React.useState(false);
  const [showCustomerCard, setShowCustomerCard] = React.useState(false);
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
        {!isEditFlag ? (
          !showCustomerFields ? (
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
          ) : !showCustomerCard ? (
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
              />
              <TextInput
                value={sonOf ? sonOf : ""}
                label="son/of"
                placeholder="son of"
                onChange={(event) => setSonOf(event.currentTarget.value)}
              />{" "}
              <TextInput
                value={customerCNIC}
                onChange={(event) => {
                  setCustomerCNIC(event.currentTarget.value);
                }}
                label="cnic no"
                placeholder="cnic no"
              />
              <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
                <Flex direction="row" gap="md">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCustomerCard(true);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCustomerFields(false);
                      setCustomerName("");
                      setSonOf("");
                      setIsNewCustomer(false);
                    }}
                  >
                    Back
                  </Button>
                </Flex>
              </Box>
            </Flex>
          ) : (
            <CustomerDetailCard
              customerCNIC={customerCNIC ? customerCNIC : ""}
              customerName={customerName}
              sonOf={sonOf ? sonOf : null}
              setShowCustomerCard={setShowCustomerCard}
              setShowCustomerFields={setShowCustomerFields}
              setIsEditFlag={setIsEditFlag}
            />
          )
        ) : (
          <CustomerDetailCard
            customerCNIC={customerCNIC ? customerCNIC : ""}
            customerName={customerName}
            sonOf={sonOf ? sonOf : null}
            setShowCustomerCard={setShowCustomerCard}
            setShowCustomerFields={setShowCustomerFields}
            setIsEditFlag={setIsEditFlag}
          />
        )}
      </Card.Section>
    </Card>
  );
};

type CustomerDetailProps = {
  customerCNIC: string;
  customerName: string | undefined;
  sonOf: string | null;
  setShowCustomerCard: (val: boolean) => void;
  setShowCustomerFields: (val: boolean) => void;
  setIsEditFlag: (val: boolean) => void;
};

const CustomerDetailCard: React.FC<CustomerDetailProps> = (
  props: CustomerDetailProps
) => {
  const {
    customerCNIC,
    customerName,
    sonOf,
    setShowCustomerFields,
    setShowCustomerCard,
    setIsEditFlag,
  } = props;

  return (
    <Group position="apart">
      <Flex
        direction={"row"}
        sx={(theme) => ({ columnGap: theme.spacing.xl * 2.5 })}
      >
        {" "}
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>Name:</Title>
          <Text>{customerName} </Text>
        </Flex>
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>Son of:</Title>
          <Text> {sonOf} </Text>
        </Flex>
        <Flex
          direction={"row"}
          columnGap={"xs"}
          sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
        >
          <Title order={5}>CNIC no:</Title>
          <Text> {customerCNIC} </Text>
        </Flex>
      </Flex>
      <Button
        variant="outline"
        onClick={() => {
          setIsEditFlag(false);
          setShowCustomerFields(true);
          setShowCustomerCard(false);
        }}
      >
        Edit
      </Button>
    </Group>
  );
};

type PaymentPlanView = {
  paymentPlan: TableRowItem[];
  descriptionField?: boolean;
  setTableRows: (val: TableRowItem[]) => void;
  setIsEditForm: (val: boolean) => void;
};

const PaymentPlanView: React.FC<PaymentPlanView> = (props: PaymentPlanView) => {
  const { paymentPlan, descriptionField, setIsEditForm, setTableRows } = props;
  const jsxRows: JSX.Element[] = [];

  paymentPlan.forEach((item, index) => {
    const key = index;
    const date = new Date(`${item.dateISOString}`);
    const description = item.description;
    const dateString = date.toDateString();
    const value = item.value;

    jsxRows.push(
      <tr key={key}>
        <td>{dateString}</td>
        <td>{description}</td>
        <td>{value}</td>
      </tr>
    );
  });

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ overflow: "inherit", margin: "15px 0 0 0" }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart" mt="3px" mb="0px">
          <Title order={3}>Payment Plan</Title>
          <Button
            variant="outline"
            onClick={() => {
              setTableRows([]);
              setIsEditForm(false);
            }}
          >
            Delete Plan
          </Button>
        </Group>
      </Card.Section>

      <Card>
        <Card.Section inheritPadding py="md">
          <Table highlightOnHover fontSize="lg">
            <thead>
              <tr>
                <th>Date</th>
                {descriptionField ? <th>Description</th> : undefined}
                <th>Value</th>
              </tr>
            </thead>
            <tbody>{jsxRows}</tbody>
          </Table>
        </Card.Section>
      </Card>
    </Card>
  );
};

export default NewPlot;
