import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

export class AlarmExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly Stringifier: bg.CsvStringifierPort,
    private readonly alarms: VO.AlarmSnapshot[],
  ) {
    super({ filename: `alarm-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return this.Stringifier.process(["id", "name"], this.alarms);
  }
}
