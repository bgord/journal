import * as RR from "react-router";

export function Header() {
  const root = RR.useRouteLoaderData("root") as { user: { email?: string } | null } | undefined;
  const user = root?.user ?? null;

  return (
    <header data-stack="x" data-main="between" data-p="3">
      <div>Journal</div>
      {user ? (
        <RR.Form method="post" action="/logout">
          <span data-mr="3">{user.email}</span>
          <button className="c-button" data-variant="secondary" type="submit">
            Sign out
          </button>
        </RR.Form>
      ) : null}
    </header>
  );
}
