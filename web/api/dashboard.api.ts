import * as bg from "@bgord/ui";
import type { DashboardDataType } from "../../app/http/get-dashboard";

export class Dashboard {
  static async get(request: Request | null): Promise<DashboardDataType | null> {
    return bg.ApiClient.json<DashboardDataType | null>("/api/dashboard/get", request, null);
  }
}

export type { DashboardDataType } from "../../app/http/get-dashboard";
