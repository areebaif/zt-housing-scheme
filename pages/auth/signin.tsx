import * as React from "react";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";

import { useSession, signIn, signOut } from "next-auth/react";

const Login: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userEmail, setUserEmail] = React.useState("");
  // need an input prop, on submit i will check if that user exists in db and only then trigger signIn process, otherwise give error
  if (session) {
    router.push("/");
    return <div>hello</div>;
  } else {
    return <Button onClick={() => signIn()}>Sign In</Button>;
  }
};

export default Login;
