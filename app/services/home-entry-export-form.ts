import { EntryExportStrategyOptions } from "../../modules/emotions/value-objects/entry-export-strategy-options";

export const HomeEntryExportForm = {
  strategy: {
    options: Object.keys(EntryExportStrategyOptions),
    defaultValue: EntryExportStrategyOptions.text,
  },
};

export type * as types from "../../modules/emotions/value-objects";
