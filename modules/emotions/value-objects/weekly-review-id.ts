import * as bg from "@bgord/bun";
import * as v from "valibot";

export const WeeklyReviewId = v.pipe(bg.UUID, v.brand("WeeklyReviewId"));
export type WeeklyReviewIdType = v.InferOutput<typeof WeeklyReviewId>;
