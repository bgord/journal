import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";
import * as Adapters from "+infra/adapters";

export class EntryExportFileCsv extends bg.FileDraft {
  constructor(private readonly entries: VO.EntrySnapshot[]) {
    super({ filename: `entry-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return Adapters.CsvStringifier.process(["id", "situationDescription"], this.entries);
  }
}
