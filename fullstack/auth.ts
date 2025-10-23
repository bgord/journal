import type { auth } from "../infra/auth";

export type SessionType = typeof auth.$Infer.Session;

async function getSessionServer(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  const response = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return await response.json().catch();
}

async function getSessionClient() {
  const response = await fetch("/api/auth/get-session", { credentials: "include" });

  if (!response?.ok) return null;

  return await response.json().catch();
}

export async function getSession(request: Request | null): Promise<SessionType | null> {
  if (request) return getSessionServer(request);
  return getSessionClient();
}
