import { EntryListFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";

export const Form = {
  filter: { options: Object.keys(EntryListFilterOptions), field: { name: "filter" } },
  query: { field: { name: "query" } },
  default: { filter: EntryListFilterOptions.last_week, query: "" },
  isDefault: (search: { filter: string; query: string }): boolean =>
    search.filter === EntryListFilterOptions.last_week && search.query === "",
};

export type * as types from "../../modules/emotions/value-objects";
