import * as bg from "@bgord/bun";
import type { z } from "zod/v4";

export const WeeklyReviewId = bg.UUID;
export type WeeklyReviewIdType = z.infer<typeof WeeklyReviewId>;
