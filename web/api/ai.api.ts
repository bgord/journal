import * as bg from "@bgord/ui";
import type { AiUsageTodayType } from "../../app/http/ai";

export class AI {
  static async getUsageToday(request: Request | null): Promise<AiUsageTodayType | null> {
    return bg.ApiClient.json<AiUsageTodayType | null>("/api/ai-usage-today/get", request, null);
  }
}
