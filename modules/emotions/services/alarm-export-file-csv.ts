import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class AlarmExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly alarms: VO.AlarmSnapshot[],
    private readonly deps: Dependencies,
  ) {
    super(tools.Basename.parse(`alarm-export-${deps.Clock.now().ms}`), tools.MIMES.csv);
  }

  create() {
    return this.deps.CsvStringifier.process(["id", "name"], this.alarms);
  }
}
