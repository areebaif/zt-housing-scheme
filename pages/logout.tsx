import * as React from "react";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";

import { useSession, signIn, signOut } from "next-auth/react";

const Login: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return <Button onClick={() => signOut()}>Sign Out</Button>;
  } else {
    return <div>hello</div>;
  }
};

export default Login;
