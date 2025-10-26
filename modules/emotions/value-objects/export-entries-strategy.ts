import { z } from "zod/v4";
import { ExportEntriesStrategy } from "./export-entries-strategy-options";

export const ExportEntriesStrategySchema = z.enum(ExportEntriesStrategy).default(ExportEntriesStrategy.text);

export type ExportEntriesStrategyType = z.infer<typeof ExportEntriesStrategySchema>;
