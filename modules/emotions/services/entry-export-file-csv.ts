import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class EntryExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly entries: ReadonlyArray<VO.EntrySnapshot>,
    private readonly deps: Dependencies,
  ) {
    super(
      tools.Basename.parse(`entry-export-${deps.Clock.now().ms}`),
      tools.Extension.parse("csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    return this.deps.CsvStringifier.process(["id", "situationDescription"], this.entries);
  }
}
