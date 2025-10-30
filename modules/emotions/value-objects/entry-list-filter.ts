import { z } from "zod/v4";
import { EntryListFilterOptions } from "./entry-list-filter-options";

export const EntryListFilter = z.enum(EntryListFilterOptions).default(EntryListFilterOptions.today);

export type EntryListFilterType = z.infer<typeof EntryListFilter>;
