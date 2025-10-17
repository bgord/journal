import { Link } from "react-router";
import { SessionWidget } from "./session-widget";

export function Home() {
  return (
    <main>
      <header>Home here</header>
      <SessionWidget />
      <Link to="/login">Login</Link>
    </main>
  );
}
