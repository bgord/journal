import { Form as form } from "@bgord/ui";
import { EntryExportStrategyOptions } from "../../modules/emotions/value-objects/entry-export-strategy-options";

export const Form = {
  dateRangeStart: { field: { name: "dateRangeStart", defaultValue: form.date.min.yesterday() } },
  dateRangeEnd: { field: { name: "dateRangeEnd", defaultValue: form.date.min.today() } },
  strategy: {
    field: { name: "strategy", defaultValue: EntryExportStrategyOptions.text },
    options: Object.keys(EntryExportStrategyOptions),
  },
};

export type * as types from "../../modules/emotions/value-objects";
