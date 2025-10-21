import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";
import { Home } from "./home";
import { Weekly } from "./weekly";

export function AppShell() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/weekly" component={Weekly} />
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}
