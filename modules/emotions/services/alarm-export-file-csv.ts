import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";
import * as Adapters from "+infra/adapters";

export class AlarmExportFileCsv extends bg.FileDraft {
  constructor(private readonly alarms: VO.AlarmSnapshot[]) {
    super({ filename: `alarm-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return Adapters.CsvStringifier.process(["id", "name"], this.alarms);
  }
}
