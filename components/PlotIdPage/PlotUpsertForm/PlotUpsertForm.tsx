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
import {
  fetchAllCustomers,
  postAddPlotSale,
  postEditPlotSale,
} from "@/r-query/functions";
import { TableRowItem } from "../../TableRowsUpsert";
import { PaymentPlanInput } from ".";
import { PaymentInput } from "@/components/PlotIdPage/AddPaymentForm/PaymentInput";
import { formatAddTime } from "@/utilities";
import { CustomerSelectFields } from "@/pages/api/customer/all";

export interface FormPostProps {
  plotId: string;
  sellPrice: number;
  soldDateString: string;
  customer: {
    customerCNIC: string;
    customerName: string;
    sonOf: string;
    newCustomer: boolean;
  };
  paymentPlan: TableRowItem[];
  isEditPaymentPlan: boolean;
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
  setShowForm: (val: boolean) => void;
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
    setShowForm,
  } = props;
  const queryClient = useQueryClient();
  // // router props
  const router = useRouter();

  // plot metadata props
  const [plotId, setPlotId] = React.useState(plotNumber);
  const [dimension, setDimension] = React.useState(dimensionString);
  const [squareFeet, setSquareFeet] = React.useState(squareFt);
  // sell info props
  const [sellPrice, setSellPrice] = React.useState<number | undefined>(
    soldPrice
  );

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
  const [isEditPaymentPlan, setIsEditPaymentPlan] = React.useState(false);

  // fetch exisitng customer data from backend
  const fetchCustomers = useQuery({
    queryKey: ["allCustomers"],
    queryFn: () => fetchAllCustomers(),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: !isEditForm ? postAddPlotSale : postEditPlotSale,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setShowForm(false);
      router.push(`/plot/${plotId}`);
    },
    onError: () => {
      return <div>error occured: Please try again later</div>;
    },
  });
  const onSubmitForm = () => {
    // plot and sell information validation
    if (!plotId || !sellDate || !sellPrice)
      throw new Error(
        "please provide plotNumber, Sell Date ad Sell Price to submit the form"
      );
    //customer data fields validation
    if (!customerCNIC) throw new Error("Please enter cnic");
    if (isNewCustomer && (!customerName || !customerCNIC || !sonOf))
      throw new Error("please enter customer name son of and cnic");
    // payment plan field validation
    const hasDownPayment = tableRows.filter((item) => {
      return item.paymentType === "down_payment";
    });
    if (!hasDownPayment.length) {
      throw new Error("please provide down payment in payment plan");
    }
    const soldDateString = formatAddTime(`${sellDate}`);
    const data: FormPostProps = {
      plotId,
      sellPrice,
      soldDateString,
      customer: {
        customerCNIC,
        customerName,
        sonOf,
        newCustomer: isNewCustomer,
      },
      paymentPlan: tableRows,
      isEditPaymentPlan,
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

    // developmentChargePercent,
    // setDevelopmentChargePercent,
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
      <CustomerDetailsInput {...customerDetailsData} />
      <SellDetailsInput {...sellDetailsData} />

      {!showEditFieldFlag ? (
        <PaymentPlanInput
          tableRows={tableRows}
          setTableRows={setTableRows}
          title={"Payment Plan"}
        />
      ) : (
        <PaymentPlanView
          paymentPlan={tableRows}
          descriptionField={true}
          setTableRows={setTableRows}
          setShowEditFieldFlag={setShowEditFieldFlag}
          setIsEditPaymentPlan={setIsEditPaymentPlan}
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
