import { ExportEntriesStrategy } from "../../modules/emotions/value-objects/export-entries-strategy-options";

export const HomeEntryExportForm = {
  strategy: { options: Object.keys(ExportEntriesStrategy), defaultValue: ExportEntriesStrategy.text },
};

export type * as types from "../../modules/emotions/value-objects";
