import * as bg from "@bgord/ui";
import type { QuotaRuleInspectionType } from "../../modules/ai/value-objects";

export class AI {
  static async getUsageToday(
    request: Request | null,
  ): Promise<(QuotaRuleInspectionType & { resetsInHours: number }) | null> {
    return bg.ApiClient.json<(QuotaRuleInspectionType & { resetsInHours: number }) | null>(
      "/api/ai-usage-today/get",
      request,
      null,
    );
  }
}
