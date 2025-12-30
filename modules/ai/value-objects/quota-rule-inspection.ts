import type * as tools from "@bgord/tools";
import type { QuotaLimitType } from "./quota-limit";
import type { QuotaRuleId } from "./quota-rule-id";

export type QuotaRuleInspectionType = {
  id: QuotaRuleId;
  consumed: boolean;
  limit: QuotaLimitType;
  count: number;
  remaining: tools.IntegerNonNegativeType;
  resetsInMs: tools.DurationMsType;
};
