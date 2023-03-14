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
  const { data: session } = useSession();
  console.log(session, "hello");
  const router = useRouter();
  const [isValidEmail, setIsValidEmail] = React.useState(false);
  const [showInvalidEmailMessage, setShowInvalidEmailMessage] =
    React.useState(false);

  // TODO: remove this when i have logout function TODO:
  //   if (session) {
  //     console.log(session, "hua");
  //     router.push("/");
  //   }

  return !showInvalidEmailMessage ? (
    isValidEmail ? (
      <div>Check your email for signin link</div>
    ) : (
      <EmailInput
        setIsValidEmail={setIsValidEmail}
        setShowInvalidEmailMessage={setShowInvalidEmailMessage}
      />
    )
  ) : (
    <>
      <div>You are not authorized to signIn</div>
      <EmailInput
        setIsValidEmail={setIsValidEmail}
        setShowInvalidEmailMessage={setShowInvalidEmailMessage}
      />
    </>
  );
};

export default Login;

type EmailInput = {
  setIsValidEmail: (data: boolean) => void;
  setShowInvalidEmailMessage: (data: boolean) => void;
};

export const EmailInput: React.FC<EmailInput> = (props: EmailInput) => {
  const { setIsValidEmail, setShowInvalidEmailMessage } = props;
  const [userEmail, setUserEmail] = React.useState("");
  const [fetchEmailStatus, setFetchEmailStatus] = React.useState(false);

  const emailStatus = ReactQuery.useQuery({
    queryKey: ["validEmail"],
    queryFn: () => fetchValidEmail(userEmail),
    enabled: fetchEmailStatus,
    onSuccess: (data) => {
      setFetchEmailStatus(false);
      if (data.email?.length) {
        const email = data.email;
        signIn("email", {
          redirect: false,
          email: email,
          callbackUrl: "http://localhost:3000/",
        });
        setIsValidEmail(true);
      } else {
        setShowInvalidEmailMessage(true);
      }
    },
  });
  //   if (emailStatus.isLoading) {
  //     return <Loader />;
  //   }

  if (emailStatus.isError) {
    return <span>Error: error occured</span>;
  }

  const onSubmit = () => {
    console.log(userEmail, "youu");
    setFetchEmailStatus(true);
    setShowInvalidEmailMessage(false);
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
            <Button onClick={onSubmit} radius="md" size="sm">
              Login
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </Container>
  );
};
