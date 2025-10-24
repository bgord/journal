import type * as tools from "@bgord/tools";
import type { QuotaLimitType } from "./quota-limit";

export type QuotaBucketInspectionType = {
  consumed: boolean;
  limit: QuotaLimitType;
  count: number;
  remaining: number;
  resetsIn: tools.Duration;
};
