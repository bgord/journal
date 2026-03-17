import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const WeeklyReviewId = bg.UUID;
export type WeeklyReviewIdType = v.InferOutput<typeof WeeklyReviewId>;
