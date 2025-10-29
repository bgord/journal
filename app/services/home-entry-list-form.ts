import { EntryListFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";

export const Form = {
  filter: {
    options: Object.keys(EntryListFilterOptions),
    field: { name: "filter", defaultValue: EntryListFilterOptions.today },
  },
};

export type * as types from "../../modules/emotions/value-objects";
