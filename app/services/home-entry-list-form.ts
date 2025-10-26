import { EntryListFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";

export const HomeEntryListForm = {
  filter: { options: Object.keys(EntryListFilterOptions), defaultValue: EntryListFilterOptions.today },
};

export type * as types from "../../modules/emotions/value-objects";
