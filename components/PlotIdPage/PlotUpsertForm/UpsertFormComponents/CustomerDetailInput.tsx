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
import { CustomerSelectFields } from "@/pages/api/customer/all";

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
              setCustomerName={setCustomerName}
              setSonOf={setSonOf}
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
            setCustomerName={setCustomerName}
            setSonOf={setSonOf}
          />
        )}
      </Card.Section>
    </Card>
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
};

const CustomerDetailCard: React.FC<CustomerDetailCardProps> = (
  props: CustomerDetailCardProps
) => {
  const {
    customerCNIC,
    customerName,
    sonOf,
    setShowCustomerFields,
    setShowCustomerCard,
    setIsEditFlag,
    setCustomerName,
    setSonOf,
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
          setShowCustomerFields(false);
          setShowCustomerCard(false);
          setCustomerName("");
          setSonOf("");
        }}
      >
        Edit
      </Button>
    </Group>
  );
};
