import * as UI from "@bgord/ui";
import { type ActionFunctionArgs, redirect } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = UI.Cookies.extractFrom(request);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-out`, {
    method: "POST",
    headers: { cookie },
  });

  const headers = new Headers();

  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") headers.append("set-cookie", value);
  });

  return redirect("/login", { headers });
}

export default function Logout() {
  return null;
}
