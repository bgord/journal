import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { stringify } from "csv";
import * as VO from "+emotions/value-objects";

export class AlarmExportFile extends bg.FileDraft {
  constructor(private readonly alarms: VO.AlarmSnapshot[]) {
    super({ filename: `alarm-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return stringify(this.alarms, { header: true, columns: ["id", "name"] });
  }
}
