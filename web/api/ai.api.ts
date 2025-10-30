import { Cookies } from "@bgord/ui";
import type { QuotaRuleInspectionType } from "../../modules/ai/value-objects";

export class AI {
  private static readonly BASE = "/api/ai-usage-today/get";

  static async getUsageToday(
    request: Request | null,
  ): Promise<(QuotaRuleInspectionType & { resetsInHours: number }) | null> {
    const url = request ? new URL(AI.BASE, request.url) : AI.BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
