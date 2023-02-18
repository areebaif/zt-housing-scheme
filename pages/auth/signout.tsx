import * as React from "react";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";

const Signout: React.FC = () => {
  return <div></div>;
  // const router = useRouter();
  // const { data: session } = useSession();
  // if (session) {
  //   return (
  //     <Button
  //       onClick={() => {
  //         //signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_DOMAIN_URL}` });
  //       }}
  //     >
  //       Sign Out
  //     </Button>
  //   );
  // } else {
  //   return <div>YPU ARE LOGGEDIN</div>;
  // }
};

export default Signout;
