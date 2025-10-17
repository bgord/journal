import * as RR from "react-router";
import { getSession } from "./auth.server";

export async function loader({ request }: RR.LoaderFunctionArgs) {
  const { json } = await getSession(request);

  return { user: json?.user ?? null };
}

export default function Root() {
  return <RR.Outlet />;
}
