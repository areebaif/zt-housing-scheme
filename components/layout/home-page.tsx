import * as React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Image } from "@mantine/core";
// Mantine Imports
import { AppShell, Header, Group, Container, Title, Flex } from "@mantine/core";

export const AppChromeMainPage: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <AppShell
      padding="md"
      header={
        <Header pl="xl" height={103}>
          <Group position="apart" pr="xl" mr="sm">
            <Flex gap="xl">
              <Link href={"/"}>
                <Image src={"/zt-logo3.png"} height={100} width={100}></Image>{" "}
              </Link>
              <Title pt="xl" mt="xs" order={2}>
                Sale and Payments Dashboard
              </Title>
            </Flex>
            <Link href={"https://www.facebook.com/zahidtown"}>
              <Image src={"/facebook-logo.png"} height={45} width={45}></Image>
            </Link>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Container fluid>{props.children}</Container>
    </AppShell>
  );
};
