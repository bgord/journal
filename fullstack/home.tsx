import { Link } from "react-router";

export function Home() {
  return (
    <main>
      <header>Home here</header>
      <Link to="/login">Login</Link>
    </main>
  );
}
