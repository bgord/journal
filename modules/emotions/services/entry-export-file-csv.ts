import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

type Dependencies = { Stringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class EntryExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly entries: VO.EntrySnapshot[],
    private readonly deps: Dependencies,
  ) {
    super({ filename: `entry-export-${deps.Clock.nowMs()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return this.deps.Stringifier.process(["id", "situationDescription"], this.entries);
  }
}
