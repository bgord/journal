import * as v from "valibot";

// Stryker disable all
export const QuotaLimit = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(1),
  v.maxValue(1000),
  v.brand("quota-limit"),
);
// Stryker restore all
export type QuotaLimitType = v.InferOutput<typeof QuotaLimit>;
