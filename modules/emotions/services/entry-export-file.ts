import type * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { stringify } from "csv";

export class EntryExportFile extends bg.FileDraft {
  constructor(private readonly entries: Schema.SelectEntries[]) {
    super({ filename: `entry-export-${Date.now()}.csv`, mime: new tools.Mime("text/csv") });
  }

  create() {
    return stringify(this.entries, { header: true, columns: ["id", "situationDescription"] });
  }
}
