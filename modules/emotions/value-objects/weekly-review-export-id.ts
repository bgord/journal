import * as bg from "@bgord/bun";
import { z } from "zod/v4";

export const WeeklyReviewExportId = bg.UUID;
export type WeeklyReviewExportIdType = z.infer<typeof WeeklyReviewExportId>;
