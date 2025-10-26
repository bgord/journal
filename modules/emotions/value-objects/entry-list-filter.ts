import { z } from "zod/v4";
import { EntryFilterOptions } from "./entry-list-filter-options";

export const EntryFilterSchema = z.enum(EntryFilterOptions).default(EntryFilterOptions.today);

export type EntryFilterType = z.infer<typeof EntryFilterSchema>;
