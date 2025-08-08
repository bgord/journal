import type { QuotaLimitType } from "./quota-limit";
import type { QuotaWindow } from "./quota-window";
import type { RequestContext } from "./request-context";
import type { UsageCategory } from "./usage-category";

type QuotaRuleName = string;

export type QuotaRule = {
  id: QuotaRuleName;
  window: QuotaWindow;
  limit: QuotaLimitType;
  bucket: (context: RequestContext) => string;
  appliesTo: (category: UsageCategory) => boolean;
};
