import { Cookies } from "@bgord/ui";
import type { auth } from "../../infra/auth";

/** @public */
export type SessionType = typeof auth.$Infer.Session;

export class Session {
  private static readonly BASE = "/api/auth/get-session";

  static async get(request: Request | null): Promise<SessionType | null> {
    const url = request ? new URL(Session.BASE, request.url) : Session.BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
