import { ErrorBoundary, LocationProvider, lazy, Route, Router } from "preact-iso";
import { Navigation } from "./navigation";

const Home = lazy(() => import("./home").then((module) => module.Home));
const Weekly = lazy(() => import("./weekly").then((module) => module.Weekly));

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Navigation />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/weekly" component={Weekly} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}
