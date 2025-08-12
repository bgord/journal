import type { QuotaLimitType } from "./quota-limit";
import type { QuotaRuleId } from "./quota-rule-id";
import type { QuotaWindow } from "./quota-window";
import type { RequestContext } from "./request-context";
import type { UsageCategory } from "./usage-category";

export type QuotaRule = {
  id: QuotaRuleId;
  window: QuotaWindow;
  limit: QuotaLimitType;
  bucket: (context: RequestContext) => string;
  appliesTo: (category: UsageCategory) => boolean;
};
