import * as v from "valibot";

export const QuotaLimit = v.pipe(
  v.number(),
  v.integer(),
  v.minValue(1),
  v.maxValue(1000),
  // Stryker disable next-line StringLiteral
  v.brand("quota-limit"),
);
export type QuotaLimitType = v.InferOutput<typeof QuotaLimit>;
