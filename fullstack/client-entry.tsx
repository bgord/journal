import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hydrate } from "preact";
import { App, type AppProps } from "./app";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } },
});

// @ts-expect-error
const state = window?.__STATE__ as AppProps;
// @ts-expect-error
const rq = (window.__RQ__ as any) ?? {};

for (const key of Object.keys(rq)) {
  const queryKey = key.includes(":") ? key.split(":") : [key];
  queryClient.setQueryData(queryKey, rq[key]);
}

hydrate(
  <QueryClientProvider client={queryClient}>
    <App {...state} />
  </QueryClientProvider>,
  document.querySelector("#root")!,
);
