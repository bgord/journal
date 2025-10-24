import type { QuotaRuleInspectionType } from "../modules/ai/value-objects";

async function getAiUsageTodayServer(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";

  const response = await fetch(new URL("/api/ai-usage-today/get", request.url), {
    headers: { cookie },
    credentials: "include",
  });

  if (!response?.ok) return null;

  return response.json().catch();
}

async function getAiUsageTodayClient() {
  const response = await fetch("/api/ai-usage-today/get", { credentials: "include" });

  if (!response?.ok) return null;

  return response.json().catch();
}

export async function getAiUsageToday(
  request: Request | null,
): Promise<(QuotaRuleInspectionType & { resetsInHours: number }) | null> {
  if (request) return getAiUsageTodayServer(request);
  return getAiUsageTodayClient();
}
