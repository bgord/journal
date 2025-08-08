import { z } from "zod/v4";

export const QuotaLimit = z.int().positive().max(1000).brand("quota-limit");
export type QuotaLimitType = z.infer<typeof QuotaLimit>;
