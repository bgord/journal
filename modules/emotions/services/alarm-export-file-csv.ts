import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

type Dependencies = { Stringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class AlarmExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly alarms: VO.AlarmSnapshot[],
    private readonly deps: Dependencies,
  ) {
    super({ filename: `alarm-export-${deps.Clock.nowMs()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return this.deps.Stringifier.process(["id", "name"], this.alarms);
  }
}
