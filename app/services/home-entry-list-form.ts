import { EntryFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";

export const HomeEntryListForm = {
  filter: { options: Object.keys(EntryFilterOptions), defaultValue: EntryFilterOptions.today },
};

export type * as types from "../../modules/emotions/value-objects";
