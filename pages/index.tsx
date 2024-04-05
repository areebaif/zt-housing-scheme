import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader, Button, Flex } from "@mantine/core";
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
      <Flex gap="md">
        {housingScheme.map((item, index) => (
          <Button
            key={index}
            href={`/housingScheme/${item.id}`}
            component={Link}
          >
            {item.name}
          </Button>
        ))}
      </Flex>
    </>
  );
};

export default HomePage;
