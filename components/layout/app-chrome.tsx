import * as React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
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
} from "@mantine/core";

import { User } from "./User";
import { IconMessages, IconDatabase, IconLogin } from "@tabler/icons-react";

export const AppChrome: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <AppShell
      padding="md"
      navbar={<Navigation />}
      header={
        <Header height={60} p="xs">
          <Title order={2}>ZT Housing Scheme Manager</Title>
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
      {session ? (
        <Navbar.Section>
          <User />
        </Navbar.Section>
      ) : (
        <div> </div>
      )}
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
    color: "blue",
    label: "Sale Summary",
    link: "/",
  },
  {
    icon: <IconMessages size={16} />,
    color: "teal",
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
    color: "blue",
    label: "Sale Summary",
    link: "/",
  },
  {
    icon: <IconMessages size={16} />,
    color: "teal",
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
