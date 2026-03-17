import * as v from "valibot";
import { EntryExportStrategyOptions } from "./entry-export-strategy-options";

export const EntryExportStrategy = v.optional(
  v.picklist(Object.values(EntryExportStrategyOptions)),
  EntryExportStrategyOptions.text,
);

export type EntryExportStrategyType = v.InferOutput<typeof EntryExportStrategy>;
