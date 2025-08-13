import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { stringify } from "csv";
import type * as Schema from "+infra/schema";

export class EntryExportFile extends bg.FileDraft {
  constructor(private readonly entries: Schema.SelectEntries[]) {
    super({ filename: `entry-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return stringify(this.entries, { header: true, columns: ["id", "situationDescription"] });
  }
}
