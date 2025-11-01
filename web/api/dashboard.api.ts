import { absoluteUrl, Cookies } from "@bgord/ui";
import type { DashboardDataType } from "../../app/http/get-dashboard";

export class Dashboard {
  private static readonly BASE = "/api/dashboard/get";

  static async get(request: Request | null): Promise<DashboardDataType | null> {
    const url = absoluteUrl(Dashboard.BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}

export type { DashboardDataType } from "../../app/http/get-dashboard";
