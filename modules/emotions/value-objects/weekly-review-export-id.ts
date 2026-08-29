import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const WeeklyReviewExportId = v.pipe(bg.UUID, v.brand("WeeklyReviewExportId"));
