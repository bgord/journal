import { Cookies } from "@bgord/ui";
import type { auth } from "../infra/auth";

export type SessionType = typeof auth.$Infer.Session;

async function getSessionServer(request: Request) {
  const response = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: { cookie: Cookies.extractFrom(request) },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return response.json().catch();
}

async function getSessionClient() {
  const response = await fetch("/api/auth/get-session", { credentials: "include" });

  if (!response?.ok) return null;

  return response.json().catch();
}

export async function getSession(request: Request | null): Promise<SessionType | null> {
  if (request) return getSessionServer(request);
  return getSessionClient();
}
