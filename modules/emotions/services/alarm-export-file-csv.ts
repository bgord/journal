import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+emotions/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class AlarmExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly alarms: ReadonlyArray<VO.AlarmSnapshot>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `alarm-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    return this.deps.CsvStringifier.process(["id", "name"], this.alarms);
  }
}
