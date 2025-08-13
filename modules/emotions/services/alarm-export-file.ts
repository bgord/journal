import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { stringify } from "csv";
import type * as Schema from "+infra/schema";

export class AlarmExportFile extends bg.FileDraft {
  constructor(private readonly alarms: Schema.SelectAlarms[]) {
    super({ filename: `alarm-export-${Date.now()}.csv`, mime: tools.MIMES.csv });
  }

  create() {
    return stringify(this.alarms, { header: true, columns: ["id", "name"] });
  }
}
