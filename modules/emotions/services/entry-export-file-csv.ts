import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { stringify } from "csv";
import type * as VO from "+emotions/value-objects";

export class EntryExportFileCsv extends bg.FileDraft {
  constructor(private readonly entries: VO.EntrySnapshot[]) {
    super({ filename: `entry-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return stringify(this.entries, { header: true, columns: ["id", "situationDescription"] });
  }
}
