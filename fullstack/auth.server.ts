export async function getSession(request: Request) {
  const response = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie: request.headers.get("cookie") ?? "" },
    credentials: "include",
  });

  const json = await response.json().catch();

  return { res: response, json };
}
