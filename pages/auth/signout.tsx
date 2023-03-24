import * as React from "react";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";

const Signout: React.FC = () => {
  return (
    <Button
      onClick={() => {
        signOut({ callbackUrl: "/" });
      }}
    >
      Sign Out
    </Button>
  );
};

export default Signout;
