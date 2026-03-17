import * as v from "valibot";
import { EntryListFilterOptions } from "./entry-list-filter-options";

export const EntryListFilter = v.optional(
  v.picklist(Object.values(EntryListFilterOptions)),
  EntryListFilterOptions.last_week,
);

export type EntryListFilterType = v.InferOutput<typeof EntryListFilter>;
