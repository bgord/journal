import { Outlet } from "react-router";
import { requireSession } from "../../auth-guard";
import type { Route } from "./+types/auth-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireSession(request);
  return { session };
}

export default function AuthLayout({ loaderData }: Route.ComponentProps) {
  return <Outlet context={{ ...loaderData.session }} />;
}
