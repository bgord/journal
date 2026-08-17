import * as bg from "@bgord/bun";
import * as v from "valibot";

export const WeeklyReviewExportId = v.pipe(bg.UUID, v.brand("WeeklyReviewExportId"));
