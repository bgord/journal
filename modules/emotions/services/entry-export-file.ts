import type * as Schema from "+infra/schema";
import { stringify } from "csv";

// TODO: FileDraft that defines filename and mime, to be extended by target files

export class EntryExportFile {
  private static COLUMNS = ["id", "situationDescription"];

  constructor(private readonly entries: Schema.SelectEntries[]) {}

  generate() {
    return stringify(this.entries, {
      header: true,
      columns: EntryExportFile.COLUMNS,
    });
  }
}
