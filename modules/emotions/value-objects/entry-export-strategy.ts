import { z } from "zod/v4";
import { EntryExportStrategyOptions } from "./entry-export-strategy-options";

export const EntryExportStrategy = z
  .enum(EntryExportStrategyOptions)
  .default(EntryExportStrategyOptions.text);

export type EntryExportStrategyType = z.infer<typeof EntryExportStrategy>;
