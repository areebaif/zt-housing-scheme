import * as React from "react";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";

const Signout: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session, "huaa");
  return (
    <Button
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </Button>
  );
};

export default Signout;
