import type * as Schema from "+infra/schema";
import csv from "csv";

// FileDraft that defines filename and mime
// Streaming?

export class EntryExportFile {
  private static COLUMNS = ["id", "situationDescription"];

  constructor(private readonly entries: Schema.SelectEntries[]) {}

  generate() {
    return csv.stringify(this.entries, {
      header: true,
      columns: EntryExportFile.COLUMNS,
    });
  }
}
