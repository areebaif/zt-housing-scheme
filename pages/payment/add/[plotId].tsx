import * as React from "react";
import { useRouter } from "next/router";
import { Text, Group, Button } from "@mantine/core";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  UpsertTableRows,
  TableRowItem,
} from "../../../components/TableRowsUpsert";
import { postPlotPayment } from "@/r-query/functions";

const AddPayment: React.FC = () => {
  const queryClient = useQueryClient();
  // router
  const router = useRouter();
  const routerReady = router.isReady;
  const query = router.query;
  // plot details
  const [plotId, setPlotId] = React.useState("");
  // customer details
  const [customerId, setCustomerId] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [sonOf, setSonOf] = React.useState("");
  const [customerCNIC, setCustomerCNIC] = React.useState("");
  // table props
  const [tableRows, setTableRows] = React.useState<TableRowItem[]>([]);

  const mutation = useMutation({
    mutationFn: postPlotPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plotById"] });
      router.push(`/plot/${plotId}`);
    },
  });

  const onSubmitForm = () => {
    // data validation
    if (!tableRows) throw new Error(" Please provide data to submit");
    console.log(tableRows, "mizz");
    const data = { payment: tableRows, customerId, plotId };
    mutation.mutate(data);
  };

  React.useEffect(() => {
    const plot = query.plotId as string;
    const customerId = query.customerId as string;
    const name = query.customerName as string;
    const sonOf = query.sonOf as string;
    const cnic = query.cnic as string;
    setPlotId(plot);
    setCustomerId(customerId);
    setCustomerCNIC(cnic);
    setCustomerName(name);
    setSonOf(sonOf);
  }, [routerReady]);
  return (
    <React.Fragment>
      <Text>
        PlotNumber: {plotId} Customer Name: {customerName} sonOf: {sonOf} cnic:{" "}
        {customerCNIC}
      </Text>
      <UpsertTableRows
        tableHeader={"Add Payment"}
        tableRows={tableRows}
        setTableRows={setTableRows}
        descriptionField={true}
      />
      <Group position="right">
        <Button onClick={onSubmitForm} variant="outline">
          Submit
        </Button>
      </Group>
    </React.Fragment>
  );
};

export default AddPayment;
