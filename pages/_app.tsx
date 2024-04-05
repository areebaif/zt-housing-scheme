import * as React from "react";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { MantineProvider, Text } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AppChrome, AppChromeMainPage } from "@/components";
import dynamic from "next/dynamic";

const App = ({
  Component,
  router,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const [queryClient] = React.useState(() => new QueryClient());
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    return (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Text size="xl">
          This website is under maintenance. Please contact admin for details.
        </Text>
      </MantineProvider>
    );
  } else {
    return (
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            {router.route.startsWith("/housingScheme") ? (
              <AppChrome>
                <Component {...pageProps} />
                <Analytics />
              </AppChrome>
            ) : (
              <AppChromeMainPage>
                <Component {...pageProps} />
                <Analytics />
              </AppChromeMainPage>
            )}
            {/* <AppChrome>
              <Component {...pageProps} />
              <Analytics />
            </AppChrome> */}
          </MantineProvider>
        </QueryClientProvider>
      </SessionProvider>
    );
  }
};
//
//export default App;
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
