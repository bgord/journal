import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hydrate } from "preact";
import { App, type AppProps } from "./app";

const queryClient = new QueryClient();

// @ts-expect-error
const state = window?.__STATE__ as AppProps;
// @ts-expect-error
const rq = window.__RQ__ as any;

hydrate(
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={rq}>
      <App {...state} />
    </HydrationBoundary>
  </QueryClientProvider>,
  document.querySelector("#root")!,
);
