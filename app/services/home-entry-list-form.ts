import * as bg from "@bgord/ui";
import { EntryListFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";

export const Form = {
  filter: { options: Object.values(EntryListFilterOptions), field: { name: "filter" } },
  query: { field: { name: "query" } },
  ...bg.SearchParam.form({
    filter: bg.SearchParam.oneOf(Object.values(EntryListFilterOptions)),
    query: bg.SearchParam.text(),
  }),
};

export type * as types from "../../modules/emotions/value-objects";
