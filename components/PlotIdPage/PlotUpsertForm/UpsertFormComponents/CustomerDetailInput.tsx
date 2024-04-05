import * as React from "react";
import {
  Box,
  Card,
  TextInput,
  Group,
  Flex,
  Text,
  Button,
  Title,
} from "@mantine/core";
import { CustomerSelectFields } from "@/pages/api/customers";
import { formatCnic } from "@/utilities";

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
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerAddress: string;
  setCustomerAddres: (val: string) => void;
};
export const CustomerDetailsInput: React.FC<CustomerDetailsInputProps> = (
  props
) => {
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
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddres,
  } = props;
  const [isEditFlag, setIsEditFlag] = React.useState(isEditForm);
  const [showCustomerFields, setShowCustomerFields] = React.useState(false);
  const [showCustomerCard, setShowCustomerCard] = React.useState(false);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (customerCNIC.length === 13 || customerCNIC.length === 15) {
        const result = formatCnic(customerCNIC);
        setCustomerCNIC(result);
        FindExistingCustomerSetValues(result);
      } else {
        throw new Error("Please enter valid cnic");
      }
    }
  };

  const FindExistingCustomerSetValues = (result: string) => {
    const exisitngCustomer = existingCustomerBackendData?.filter(
      (item) => item.value === result
    );

    if (exisitngCustomer?.length) {
      setCustomerName(exisitngCustomer[0].name);
      setSonOf(exisitngCustomer[0].son_of ? exisitngCustomer[0].son_of : "");
      setCustomerPhone(exisitngCustomer[0].phone);
      setCustomerAddres(
        exisitngCustomer[0].address ? exisitngCustomer[0].address : ""
      );
      setShowCustomerFields(true);
      //
    } else {
      setIsNewCustomer(true);
      setShowCustomerFields(true);
    }
  };

  const CutsomerAllFields = {
    customerName,
    sonOf,
    setSonOf,
    setCustomerName,
    setShowCustomerFields,
    setShowCustomerCard,
    setIsNewCustomer,
    customerCNIC,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddres,
  };

  const customerDetail = {
    customerCNIC: customerCNIC ? customerCNIC : "",
    customerName,
    sonOf: sonOf ? sonOf : null,
    setShowCustomerCard,
    setShowCustomerFields,
    setIsEditFlag,
    setCustomerName,
    setSonOf,
    setIsNewCustomer,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddres,
  };

  const CnicInputField = {
    customerCNIC,
    setCustomerCNIC,
    onKeyDown,
    FindExistingCustomerSetValues,
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
            <CNICInputField {...CnicInputField} />
          ) : !showCustomerCard ? (
            <CustomerAllFields {...CutsomerAllFields} />
          ) : (
            <CustomerDetailCard {...customerDetail} />
          )
        ) : (
          <CustomerDetailCard {...customerDetail} />
        )}
      </Card.Section>
    </Card>
  );
};

type CustomerAllFields = {
  customerName: string;
  setCustomerName: (val: string) => void;
  sonOf: string;
  setSonOf: (val: string) => void;
  setShowCustomerFields: (val: boolean) => void;
  setShowCustomerCard: (val: boolean) => void;
  setIsNewCustomer: (val: boolean) => void;
  customerCNIC: string;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerAddress: string;
  setCustomerAddres: (val: string) => void;
};

export const CustomerAllFields: React.FC<CustomerAllFields> = (
  props: CustomerAllFields
) => {
  const {
    customerName,
    sonOf,
    setSonOf,
    setCustomerName,
    setShowCustomerFields,
    setShowCustomerCard,
    setIsNewCustomer,
    customerCNIC,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddres,
  } = props;
  return (
    <Group position="apart" sx={(theme) => ({ alignItems: "flex-start" })}>
      <Flex direction="column" align="flex-start" gap="md" justify="flex-start">
        <Flex
          direction="row"
          align="flex-start"
          justify="flex-start"
          sx={(theme) => ({ gap: theme.spacing.xl * 2 })}
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
            value={customerPhone}
            label="phone no"
            placeholder="phone no"
            onChange={(event) => setCustomerPhone(event.currentTarget.value)}
          />{" "}
        </Flex>
        <Flex
          direction="row"
          align="flex-start"
          justify="flex-start"
          sx={(theme) => ({ gap: theme.spacing.xl * 2 })}
        >
          <TextInput
            value={customerAddress}
            label="address"
            placeholder="address"
            onChange={(event) => setCustomerAddres(event.currentTarget.value)}
          />{" "}
          <Box
            sx={(theme) => ({
              paddingTop: theme.spacing.xs * 0.5,
              //paddingLeft: theme.spacing.xs,
            })}
          >
            <Text weight={500} size={"sm"}>
              cnic:
            </Text>{" "}
            <Text
              sx={(theme) => ({
                paddingTop: theme.spacing.xs * 0.5,
              })}
            >
              {customerCNIC}
            </Text>
          </Box>
        </Flex>
      </Flex>
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
              setCustomerAddres("");
              setCustomerPhone("");
              setIsNewCustomer(false);
            }}
          >
            Back
          </Button>
        </Flex>
      </Box>
    </Group>
  );
};

type CustomerDetailCardProps = {
  customerCNIC: string;
  customerName: string | undefined;
  sonOf: string | null;
  setShowCustomerCard: (val: boolean) => void;
  setShowCustomerFields: (val: boolean) => void;
  setIsEditFlag: (val: boolean) => void;
  setCustomerName: (va: string) => void;
  setSonOf: (va: string) => void;
  setIsNewCustomer: (val: boolean) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerAddress: string;
  setCustomerAddres: (val: string) => void;
};

const CustomerDetailCard: React.FC<CustomerDetailCardProps> = (
  props: CustomerDetailCardProps
) => {
  const {
    customerCNIC,
    customerName,
    sonOf,
    customerPhone,
    customerAddress,
    setShowCustomerFields,
    setShowCustomerCard,
    setIsEditFlag,
    setCustomerName,
    setSonOf,
    setIsNewCustomer,
    setCustomerPhone,
    setCustomerAddres,
  } = props;

  return (
    <Group position="apart">
      <Flex direction="column" align="flex-start" gap="md" justify="flex-start">
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
            <Title order={5}>Phone No:</Title>
            <Text> {customerPhone} </Text>
          </Flex>
        </Flex>
        <Flex
          direction="row"
          align="flex-start"
          justify="flex-start"
          sx={(theme) => ({ columnGap: theme.spacing.xl * 2.5 })}
        >
          <Flex
            direction={"row"}
            columnGap={"xs"}
            sx={(theme) => ({ paddingTop: theme.spacing.xs * 0.5 })}
          >
            <Title order={5}>Address:</Title>
            <Text> {customerAddress} </Text>
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
      </Flex>
      <Button
        variant="outline"
        onClick={() => {
          setIsEditFlag(false);
          setShowCustomerFields(false);
          setShowCustomerCard(false);
          setCustomerName("");
          setSonOf("");
          setCustomerPhone("");
          setCustomerAddres("");
          setIsNewCustomer(false);
        }}
      >
        Edit
      </Button>
    </Group>
  );
};

type CNICInputFieldProps = {
  customerCNIC: string;
  setCustomerCNIC: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  FindExistingCustomerSetValues: (val: string) => void;
};

const CNICInputField: React.FC<CNICInputFieldProps> = (
  props: CNICInputFieldProps
) => {
  const {
    customerCNIC,
    setCustomerCNIC,
    onKeyDown,
    FindExistingCustomerSetValues,
  } = props;
  return (
    <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
      <TextInput
        label="CNIC Number: Type to search existing customer cnic or add a new customer"
        placeholder="CNIC"
        value={customerCNIC}
        onChange={(event) => {
          setCustomerCNIC(event.currentTarget.value);
        }}
        onKeyDown={(e) => onKeyDown(e)}
      />
      <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
        <Button
          variant="outline"
          onClick={() => {
            if (customerCNIC.length === 13 || customerCNIC.length === 15) {
              const result = formatCnic(customerCNIC);
              setCustomerCNIC(result);
              FindExistingCustomerSetValues(result);
            } else {
              throw new Error("pease enter valid cnic");
            }
          }}
        >
          Search
        </Button>
      </Box>
    </Flex>
  );
};
