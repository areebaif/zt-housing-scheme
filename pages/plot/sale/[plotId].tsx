import * as React from "react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { IconChevronDown } from "@tabler/icons";
import {
  Box,
  TextInput,
  Group,
  NumberInput,
  Flex,
  Text,
  Table,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
const NewPlot = () => {
  const router = useRouter();
  const query = router.query;
  const [plotId, setPlotId] = React.useState("");
  const [dimension, setDimension] = React.useState("");
  const [squareFeet, setSquareFeet] = React.useState("");
  const [sellPrice, setSellPrice] = React.useState<number | undefined>(0);
  const [sellDate, setSellDate] = React.useState<Date | null>(new Date());
  const [customerName, setCustomerName] = React.useState("");
  const [sonOf, setSonOf] = React.useState("");
  const [fixedPaymentPlan, setFixedPaymentPlan] = React.useState([]);
  const [recurringPaymentPlan, setRecurringPaymentPlane] = React.useState(0);

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

  return router.query.plotId ? (
    <React.Fragment>
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
          withAsterisk
          label="Square ft"
          placeholder="square ft"
        />
        <TextInput
          value={dimension}
          withAsterisk
          label="Dimension"
          onChange={(event) => setDimension(event.currentTarget.value)}
          placeholder="dimension"
        />
      </Flex>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <NumberInput
          label="Sell Price"
          value={sellPrice}
          withAsterisk
          onChange={(val) => setSellPrice(val)}
          parser={(sellPrice) => sellPrice?.replace(/\$\s?|(,*)/g, "")}
          error={
            sellPrice ? (sellPrice < 0 ? "enter values above 0" : false) : false
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
          label={"dd/mm/yyyy"}
          defaultValue={new Date()}
          withAsterisk
          value={sellDate}
          onChange={setSellDate}
        />
      </Flex>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <TextInput
          value={customerName}
          onChange={(event) => setCustomerName(event.currentTarget.value)}
          withAsterisk
          label="customer name"
          placeholder="name"
        />
        <TextInput
          value={sonOf}
          onChange={(event) => setSonOf(event.currentTarget.value)}
          withAsterisk
          label="son/of"
          placeholder="son/of"
        />
        <Text>or</Text>
      </Flex>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {fixedPaymentPlan}
          <tr>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </React.Fragment>
  ) : (
    <div>loading</div>
  );
};

export default NewPlot;
