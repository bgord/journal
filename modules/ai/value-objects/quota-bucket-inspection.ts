import type { QuotaLimitType } from "./quota-limit";
import type { QuotaRuleId } from "./quota-rule-id";

export type QuotaBucketInspectionType = {
  id: QuotaRuleId;
  consumed: boolean;
  limit: QuotaLimitType;
  count: number;
  remaining: number;
};
