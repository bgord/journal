import * as bg from "@bgord/bun";
import { z } from "zod/v4";

/** @public */
export const WeeklyReviewId = bg.UUID;
export type WeeklyReviewIdType = z.infer<typeof WeeklyReviewId>;
