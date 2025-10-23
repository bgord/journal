export type UserType = { email: string };

export async function getSessionServer(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  const response = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return await response.json().catch();
}

export async function getSessionClient() {
  const response = await fetch("/api/auth/get-session", { credentials: "include" }).catch(() => null);

  if (!response?.ok) return null;

  return await response.json().catch();
}

export async function getSession(request: Request | null): Promise<UserType | null> {
  if (request) return await getSessionServer(request);

  return await getSessionClient();
}
