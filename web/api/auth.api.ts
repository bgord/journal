import * as bg from "@bgord/ui";
import type { AuthVariables } from "../../infra/tools/shield-auth.strategy";

export type SessionType = AuthVariables;

export class Session {
  static async get(request: Request | null): Promise<SessionType | null> {
    return bg.ApiClient.json<SessionType | null>("/api/auth/get-session", request, null);
  }
}
