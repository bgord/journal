import * as UI from "@bgord/ui";
import { createAuthClient } from "better-auth/react";
import { redirect } from "react-router";

export const client = createAuthClient({ baseURL: import.meta.env.VITE_API_URL });

export const { useSession, signIn, signUp, signOut } = client;

export type Session = typeof client.$Infer.Session;
export type User = typeof client.$Infer.Session.user;

export class AuthGuard<T extends ReturnType<typeof createAuthClient>["$Infer"]["Session"]> {
  private readonly API_URL;

  constructor(BASE_URL: string) {
    this.API_URL = `${BASE_URL}/api/auth`;
  }

  async getServerSession(request: Request): Promise<T | null> {
    const cookie = UI.Cookies.extractFrom(request);

    const res = await fetch(`${this.API_URL}/get-session`, {
      headers: { cookie, accept: "application/json" },
    });

    if (!res.ok) return null;
    const session = (await res.json()) as T;

    return session;
  }

  async requireSession(request: Request): Promise<T | null> {
    const session = await this.getServerSession(request);
    if (session?.user) return session;
    throw redirect("/");
  }

  async requireNoSession(request: Request, target = "/home"): Promise<void> {
    const session = await this.getServerSession(request);
    if (session?.user) throw redirect(target);
  }
}

export const guard = new AuthGuard<Session>(import.meta.env.VITE_API_URL);
