import * as React from "react";
import { useRouter } from "next/router";
import * as ReactQuery from "@tanstack/react-query";

import {
  Button,
  TextInput,
  Card,
  Title,
  Container,
  Group,
  Text,
  Loader,
  CardSection,
} from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchValidEmail } from "@/r-query/functions";

const Login: React.FC = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState("");
  const [displayError, setDisplayError] = React.useState(false);
  const [isUserAuthorised, setIsUserAuthorized] = React.useState(false);

  const onSubmit = async () => {
    const res = await signIn("email", {
      redirect: false,
      email: userEmail,
      callbackUrl: "/",
    });
    console.log(res);
    if (res?.error) {
      setDisplayError(true);
    }
    setIsUserAuthorized(true);
  };

  return (
    <Container size={600} my={150}>
      {!displayError && !isUserAuthorised ? (
        <LoginCard
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          onSubmit={onSubmit}
        />
      ) : displayError ? (
        <UnAuthroizedEmailCard
          setDisplayError={setDisplayError}
          userEmail={userEmail}
        />
      ) : (
        <AuthroizedEmailCard />
      )}
    </Container>
  );
};

type LoginCardProps = {
  userEmail: string;
  setUserEmail: (val: string) => void;
  onSubmit: () => void;
};

const LoginCard: React.FC<LoginCardProps> = (props: LoginCardProps) => {
  const { userEmail, setUserEmail, onSubmit } = props;

  return (
    <Card shadow="sm" p="xl" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={2} ta="center" mt="xl" mb="md">
          Welcome back!
        </Title>
        <TextInput
          size="md"
          sx={{ fontSize: "xl" }}
          mt={"xl"}
          pb={"xl"}
          placeholder="email address"
          label={
            <Text
              sx={(theme) => ({
                paddingBottom: theme.spacing.xs * 0.5,
              })}
              size={"lg"}
            >
              email
            </Text>
          }
          value={userEmail}
          onChange={(event) => setUserEmail(event.currentTarget.value)}
        />
        <Group position="apart" mb={"xl"}>
          <Group spacing={"xs"} position="left">
            <Text size={"lg"}>Don't have an account ?</Text>
            <Text weight={"bold"}>Contact Admin</Text>
          </Group>
          <Button
            onClick={() => {
              onSubmit();
            }}
            radius="md"
            size="md"
          >
            Login
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};

type UnAuthroizedEmailCardProps = {
  setDisplayError: (val: boolean) => void;
  userEmail: string;
};

const UnAuthroizedEmailCard: React.FC<UnAuthroizedEmailCardProps> = (
  props: UnAuthroizedEmailCardProps
) => {
  const { setDisplayError, userEmail } = props;
  return (
    <Card shadow="sm" p="xl" radius="md" withBorder style={{ height: "100%" }}>
      <Text mt={"lg"} weight={"bold"}>
        Unauthorized email: {userEmail}
      </Text>{" "}
      <Text mt={"xs"}>
        Please contact admin to white-list this email address.
      </Text>
      <Button mt={"xl"} mb={"lg"} onClick={() => setDisplayError(false)}>
        Back
      </Button>
    </Card>
  );
};

const AuthroizedEmailCard: React.FC = () => {
  return (
    <Card shadow="sm" p="xl" radius="md" withBorder style={{ height: "100%" }}>
      <Text mt={"sm"} weight={"bold"}>
        Waiting login by email:
      </Text>{" "}
      <Text>Please check your email for login link.</Text>
    </Card>
  );
};

export default Login;
