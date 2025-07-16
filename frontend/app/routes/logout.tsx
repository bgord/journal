import { type ActionFunctionArgs, redirect } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("cookie") ?? "";

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-out`, {
    method: "POST",
    headers: { cookie },
  });

  const headers = new Headers();

  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === "set-cookie") headers.append("set-cookie", v);
  });

  /** after logout land on /login (or "/") */
  return redirect("/login", { headers });
}

/**
 * A component is still required, but it never renders because
 * <Form method="post"> triggers the action immediately.
 */
export default function Logout() {
  return null;
}
