import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso";
import { Navigation } from "./navigation";

const Home = lazy(() => import("./home").then((module) => module.Home));
const Weekly = lazy(() => import("./weekly").then((module) => module.Weekly));

export type AppProps = { translations: Record<string, string>; language: string };

const queryClient = new QueryClient();

export function App(_props: AppProps) {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Navigation />
          <Router>
            <Route path="/" component={Home} />
            <Route path="/weekly" component={Weekly} />
          </Router>
        </QueryClientProvider>
      </ErrorBoundary>
    </LocationProvider>
  );
}
