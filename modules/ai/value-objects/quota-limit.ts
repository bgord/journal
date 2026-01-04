import { z } from "zod/v4";

// Stryker disable all
export const QuotaLimit = z.int().positive().max(1000).brand("quota-limit");
// Stryker restore all
export type QuotaLimitType = z.infer<typeof QuotaLimit>;
