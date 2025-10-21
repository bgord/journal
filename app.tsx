import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";

function Home() {
  return <div>Home</div>;
}

function Weekly() {
  return <div>Weekly</div>;
}

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
