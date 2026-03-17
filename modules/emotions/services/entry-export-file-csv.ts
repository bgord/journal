import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+emotions/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class EntryExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly entries: ReadonlyArray<VO.EntrySnapshot>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `entry-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    return this.deps.CsvStringifier.process(["id", "situationDescription"], this.entries);
  }
}
