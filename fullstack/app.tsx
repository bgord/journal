import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso";
import { Navigation } from "./navigation";
import { TranslationsContext } from "./translations";

const Home = lazy(() => import("./home").then((module) => module.Home));
const Weekly = lazy(() => import("./weekly").then((module) => module.Weekly));

export type AppProps = { translations: Record<string, string>; language: string };

export function App(props: AppProps) {
  return (
    <TranslationsContext value={props}>
      <LocationProvider>
        <ErrorBoundary>
          <Navigation />
          <Router>
            <Route path="/" component={Home} />
            <Route path="/weekly" component={Weekly} />
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </TranslationsContext>
  );
}
