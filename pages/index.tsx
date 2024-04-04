import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader, Button } from "@mantine/core";
// Hook Imports
import { useQuery } from "@tanstack/react-query";
import { listHousingScheme } from "@/r-query/functions";

const HomePage: React.FC = () => {
  const fetchHousingScheme = useQuery(
    ["listHousingScheme"],
    listHousingScheme,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  if (fetchHousingScheme.isLoading) {
    return <Loader />;
  }

  if (fetchHousingScheme.isError) {
    return <span>Error: error occured</span>;
  }
  const housingScheme = fetchHousingScheme.data;

  return (
    <>
      {housingScheme.map((item, index) => (
        <Button key={index} href={`/housingScheme/${item.id}`} component={Link}>
          {item.name}
        </Button>
      ))}
    </>
  );
};

export default HomePage;
