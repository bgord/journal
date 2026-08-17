import { EntryListFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";

export const Form = {
  filter: {
    options: Object.values(EntryListFilterOptions),
    field: { name: "filter" },
    is: (value: unknown): value is EntryListFilterOptions =>
      typeof value === "string" && Object.keys(EntryListFilterOptions).includes(value),
  },
  query: { field: { name: "query" } },
  default: { filter: EntryListFilterOptions.last_week, query: "" },
  isDefault: (search: { filter: string; query: string }): boolean =>
    search.filter === EntryListFilterOptions.last_week && search.query === "",
};

export type * as types from "../../modules/emotions/value-objects";
