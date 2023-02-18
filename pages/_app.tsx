import * as React from "react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
//import { SessionProvider } from "next-auth/react";
import { AppChrome } from "@/components";

// interface AppPropsWithAuth extends AppProps {
//   Component: AppProps["Component"] & { auth: boolean };
// }

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    //<SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppChrome>
          <Component {...pageProps} />
        </AppChrome>
      </MantineProvider>
    </QueryClientProvider>
    // </SessionProvider>
  );
};

export default App;
