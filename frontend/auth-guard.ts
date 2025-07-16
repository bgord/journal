import { redirect } from "react-router";
import type { SessionType } from "../infra/auth";

export type Session = SessionType | null;

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export async function getServerSession(request: Request): Promise<Session> {
  const cookie = request.headers.get("cookie") ?? "";

  const res = await fetch(`${API}/get-session`, {
    headers: { cookie, accept: "application/json" },
  });

  if (!res.ok) return null;
  const session = (await res.json()) as Session;
  return session;
}

export async function requireSession(request: Request): Promise<Session> {
  const session = await getServerSession(request);
  if (session?.user) return session;
  throw redirect("/login");
}

export async function requireNoSession(request: Request, target = "/home"): Promise<void> {
  const session = await getServerSession(request);
  if (session?.user) throw redirect(target);
}
