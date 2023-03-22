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
} from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchValidEmail } from "@/r-query/functions";

const Login: React.FC = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState("");

  const onSubmit = async () => {
    const res = await signIn("email", {
      redirect: false,
      email: userEmail,
    });
    console.log(res);
    if (res?.error) {
      // TODO: display component saying hey your email is not authroised
      throw new Error("not authorised");
    }
    // TODO: display component saying hey check your email
  };

  return (
    <Container size={420} my={40}>
      <Card
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
        style={{ height: "100%" }}
      >
        <Card.Section withBorder inheritPadding py="xs">
          <Title order={2} ta="center" mt="md" mb="md">
            Welcome back!
          </Title>
          <TextInput
            mt={"xs"}
            placeholder="email address"
            label="email"
            withAsterisk
            value={userEmail}
            onChange={(event) => setUserEmail(event.currentTarget.value)}
          />
          <Group position="apart" mt="xl" mb={"md"}>
            <Text size={"sm"}>
              Don't have an account? <Text weight={"bold"}> Contact Admin</Text>
            </Text>
            <Button
              onClick={() => {
                onSubmit();
              }}
              radius="md"
              size="sm"
            >
              Login
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </Container>
  );
};

export default Login;
