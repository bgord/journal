import type { QuotaLimitType } from "./quota-limit";

export type QuotaBucketInspectionType = {
  consumed: boolean;
  limit: QuotaLimitType;
  count: number;
  remaining: number;
};
