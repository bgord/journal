import * as RR from "react-router";
import { signOut } from "./auth.server";

export async function action({ request }: RR.ActionFunctionArgs) {
  const res = await signOut(request);
  const setCookie = res.headers.get("set-cookie") ?? "";
  throw RR.redirect("/login", {
    headers: setCookie ? { "set-cookie": setCookie } : undefined,
  });
}
