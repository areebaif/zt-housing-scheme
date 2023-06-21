import * as React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Image } from "@mantine/core";
// Mantine Imports
import {
  AppShell,
  Navbar,
  Header,
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  Container,
  Title,
  Flex,
  Box,
} from "@mantine/core";

import { User } from "./User";
import { IconMessages, IconDatabase, IconLogin } from "@tabler/icons-react";

export const AppChrome: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <AppShell
      padding="md"
      navbar={<Navigation />}
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

const Navigation: React.FC = () => {
  const { data: session } = useSession();
  return (
    <Navbar p="xs" width={{ base: 275 }}>
      <Navbar.Section grow mt="md">
        <MainLinks />
      </Navbar.Section>

      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
};

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

function MainLink({ icon, color, label, link }: MainLinkProps) {
  const router = useRouter();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => {
        router.push(link);
      }}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const logoutData = [
  {
    icon: <IconDatabase size={16} />,
    color: "teal",
    label: "Sale Summary",
    link: "/",
  },
  {
    icon: <IconMessages size={16} />,
    color: "blue",
    label: "Payment Status",
    link: "/plot/paymentStatus",
  },
  {
    icon: <IconLogin size={16} />,
    color: "violet",
    label: "Logout",
    link: "/auth/signout",
  },
];

const loginData = [
  {
    icon: <IconDatabase size={16} />,
    color: "teal",
    label: "Sale Summary",
    link: "/",
  },
  {
    icon: <IconMessages size={16} />,
    color: "blue",
    label: "Payment Status",
    link: "/plot/paymentStatus",
  },
  {
    icon: <IconLogin size={16} />,
    color: "violet",
    label: "Login",
    link: "/auth/signin",
  },
];

export function MainLinks() {
  const { data: session } = useSession();
  const links = session
    ? logoutData.map((link) => <MainLink {...link} key={link.label} />)
    : loginData.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
