import * as RR from "react-router";
import { getSession } from "./auth.server";

function redirectTarget(request: Request) {
  const url = new URL(request.url);
  // send them back to where they tried to go
  return `/login?from=${encodeURIComponent(url.pathname + url.search)}`;
}

export async function loader({ request }: RR.LoaderFunctionArgs) {
  const { json } = await getSession(request);

  const user = json?.user ?? null;

  if (!user) throw RR.redirect(redirectTarget(request));

  return { user };
}

export default function Protected() {
  return <RR.Outlet />;
}
