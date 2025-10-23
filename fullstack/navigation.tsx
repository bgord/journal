import { Link, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./router";

export function Navigation() {
  const { session } = useLoaderData({ from: rootRoute.id });

  return (
    <nav data-stack="y">
      <header data-stack="x" data-cross="center" data-gap="6" data-p="3">
        <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
          <Link to="/">Journal</Link>
        </div>

        <a href="/dashboard" className="c-link" data-transform="uppercase" data-ml="auto">
          Dashboard
        </a>

        <a
          href="/profile"
          className="c-link"
          data-disp="flex"
          data-cross="center"
          data-gap="2"
          data-fs="base"
          data-fw="medium"
        >
          <img
            src="/profile-avatar/get"
            title={session.user.email}
            alt=""
            width={48}
            height={48}
            style={{ borderRadius: 9999, objectFit: "cover" }}
            data-bc="neutral-700"
            data-bwb="hairline"
          />
        </a>

        <form action="/api/auth/sign-out" method="post">
          <button className="c-link" type="submit">
            Logout
          </button>
        </form>
      </header>
    </nav>
  );
}
