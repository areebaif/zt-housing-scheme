import * as React from "react";
import { useRouter } from "next/router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Group, Button, Loader } from "@mantine/core";
import {
  SellDetailsInput,
  PlotDetailsInput,
  CustomerDetailsInput,
  PaymentPlanView,
} from ".";
import { fetchAllCustomers, postAddPlotSale } from "@/r-query/functions";
import { TableRowItem } from "../../TableRowsUpsert";
import { PaymentInput } from "@/components/PlotIdPage/AddPaymentForm/PaymentInput";
import { formatAddTime } from "@/utilities";
import { CustomerSelectFields } from "@/pages/api/customer/all";

// TODO: show development Charges in Payment Plan when are they collected????
interface FormPostProps {
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
interface AddSaleFormProps {
  plotNumber: string;
  dimensionString: string;
  squareFt: string;
  soldPrice: number | undefined;
  plotDownPayment: number | undefined;
  name: string;
  son_of: string;
  cnic: string;
  soldDate: Date | null;
  futurePaymentPlan: TableRowItem[] | [];
  isEditForm: boolean;
  //setIsEditForm: (val: boolean) => void;
}

export const PlotUpsertForm: React.FC<AddSaleFormProps> = (
  props: AddSaleFormProps
) => {
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
    plotDownPayment,
    //setIsEditForm,
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
    plotDownPayment
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
  const [showEditFieldFlag, setShowEditFieldFlag] = React.useState(isEditForm);

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
    setExistingCustomerBackendData(fetchCustomers.data);
  }, [fetchCustomers.data]);

  if (fetchCustomers.isLoading || mutation.isLoading) {
    // TODO: loading component
    return <Loader />;
  }

  if (fetchCustomers.isError) {
    return <Loader />;
  }

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

      {!showEditFieldFlag ? (
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
          setShowEditFieldFlag={setShowEditFieldFlag}
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
