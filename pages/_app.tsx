import * as React from "react";
import { MantineProvider } from "@mantine/core";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { AppChrome } from "@/components";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
          withGlobalStyles
          withNormalizeCSS
      >
          <AppChrome>
      <Component {...pageProps} />
          </AppChrome>
      </MantineProvider>
    </QueryClientProvider>
  );
}
