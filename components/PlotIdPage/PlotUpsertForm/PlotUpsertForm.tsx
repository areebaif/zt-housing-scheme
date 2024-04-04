import * as React from "react";
import { useRouter } from "next/router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Plot } from "@prisma/client";
import { Group, Button, Loader } from "@mantine/core";
import { formatAddTime } from "@/utilities";
import { CustomerSelectFields } from "@/pages/api/customers";
import {
  SellDetailsInput,
  PlotDetailsInputCard,
  CustomerDetailsInput,
  PaymentPlanInputCard,
} from ".";
import {
  listCustomers,
  createSalePlot,
  editSalePlot,
} from "@/r-query/functions";
import { TableRowItem } from "../AddPaymentForm/PaymentInputTable";

export type AllPlotId = {
  id: number;
  squareFeet: string;
  dimension: string;
  sellPrice: number | undefined;
};
export type CustomerFormPost = {
  customerCNIC: string;
  customerName: string;
  sonOf: string;
  newCustomer: boolean;
  customerPhone: string;
  customerAddress: string;
};

export type FormPostProps = {
  housingSchemeId: string;
  plotId: AllPlotId[];
  sellPrice: number;
  soldDateString: string;
  customer: CustomerFormPost;
  paymentPlan: TableRowItem[];
  isEditPaymentPlan: boolean;
  isEditPlotIdDetail: boolean;
  plotSaleId: number | undefined;
};
type AddSaleFormProps = {
  plot: Plot[];
  soldPrice: number | undefined;
  name: string;
  son_of: string;
  cnic: string;
  phone: string;
  address: string;
  soldDate: Date | null;
  futurePaymentPlan: TableRowItem[] | [];
  isEditForm: boolean;
  setShowForm: (val: boolean) => void;
  showForm: boolean;
  plotSaleId: number | undefined;
};

export const PlotUpsertForm: React.FC<AddSaleFormProps> = (
  props: AddSaleFormProps
) => {
  const {
    plot,
    soldPrice,
    name,
    son_of,
    cnic,
    phone,
    address,
    soldDate,
    futurePaymentPlan,
    isEditForm,
    setShowForm,
    showForm,
    plotSaleId,
  } = props;
  const queryClient = useQueryClient();
  // // router props
  const router = useRouter();
  const housingSchemeId = router.query?.housingSchemeId as string;
  // plot metadata props
  const [allPlotSale, setAllPlotSale] = React.useState<AllPlotId[]>([]);
  const [isEditPlotIdDetail, setIsEditPlotIdDetail] = React.useState(false);
  // sell info props
  const [sellPrice, setSellPrice] = React.useState<number | undefined>(
    soldPrice
  );
  const [sellDate, setSellDate] = React.useState<Date | null>(soldDate);
  // new customer props
  const [customerName, setCustomerName] = React.useState(name);
  const [sonOf, setSonOf] = React.useState(son_of);
  const [customerCNIC, setCustomerCNIC] = React.useState(cnic);
  const [customerPhone, setCustomerPhone] = React.useState(phone);
  const [customerAddress, setCustomerAddres] = React.useState(address);
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
    queryFn: () => listCustomers(),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: !isEditForm ? createSalePlot : editSalePlot,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setShowForm(false);
      router.push(`/plot/${plot[0].id}`);
    },
    onError: () => {
      return <div>error occured: Please try again later</div>;
    },
  });
  const onSubmitForm = () => {
    // plot and sell information validation
    if (!sellDate || !sellPrice)
      throw new Error(
        "please provide plotNumber, Sell Date ad Sell Price to submit the form"
      );
    //customer data fields validation
    if (!customerCNIC) throw new Error("Please enter cnic");
    if (
      isNewCustomer &&
      (!customerName ||
        !customerCNIC ||
        !sonOf ||
        !customerAddress ||
        !customerPhone)
    )
      throw new Error(
        "please enter customer name son of, phone no, address and cnic"
      );
    // payment plan field validation
    const hasDownPayment = tableRows.filter((item) => {
      return item.paymentType === "down_payment";
    });
    if (!hasDownPayment.length) {
      throw new Error("please provide down payment in payment plan");
    }
    const soldDateString = formatAddTime(`${sellDate}`);
    const data: FormPostProps = {
      housingSchemeId,
      plotId: allPlotSale,
      sellPrice,
      soldDateString,
      customer: {
        customerCNIC,
        customerName,
        sonOf,
        newCustomer: isNewCustomer,
        customerPhone,
        customerAddress,
      },
      paymentPlan: tableRows,
      isEditPaymentPlan,
      isEditPlotIdDetail,
      plotSaleId,
    };
    //console.log(data);
    mutation.mutate(data);
  };

  React.useEffect(() => {
    setExistingCustomerBackendData(fetchCustomers.data);
  }, [fetchCustomers.data]);

  if (fetchCustomers.isLoading || mutation.isLoading) {
    return <Loader />;
  }

  if (fetchCustomers.isError) {
    return <Loader />;
  }

  const plotDetailsData = {
    plot,
    isEditForm,
    showForm,
    allPlotSale,
    setAllPlotSale,
    isEditPlotIdDetail,
    setIsEditPlotIdDetail,
    sellPrice,
    setSellPrice,
  };
  const sellDetailsData = {
    sellDate,
    setSellDate,
    sellPrice,
    setSellPrice,
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
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddres,
  };
  const paymentPlanInputCard = {
    tableRows,
    setTableRows,
    setShowEditFieldFlag,
    showEditFieldFlag,
    setIsEditPaymentPlan,
  };
  return (
    <React.Fragment>
      <PlotDetailsInputCard {...plotDetailsData} />
      <SellDetailsInput {...sellDetailsData} />
      <CustomerDetailsInput {...customerDetailsData} />
      <PaymentPlanInputCard {...paymentPlanInputCard} />
      <Group position="center" style={{ margin: "15px 0 0 0" }}>
        <Button size="xl" onClick={onSubmitForm}>
          Submit
        </Button>
      </Group>
    </React.Fragment>
  );
};
