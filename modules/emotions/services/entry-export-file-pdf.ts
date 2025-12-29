import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Emotions from "+emotions";

type Dependencies = { PdfGenerator: bg.PdfGeneratorPort; Clock: bg.ClockPort };

export class EntryExportFilePdf extends bg.FileDraft {
  constructor(
    private readonly entries: Emotions.VO.EntrySnapshot[],
    private readonly deps: Dependencies,
  ) {
    super(tools.Basename.parse(`entry-export-${deps.Clock.now().ms}`), tools.MIMES.pdf);
  }

  // @ts-expect-error
  create() {
    return this.deps.PdfGenerator.request("entry_export", { entries: this.entries });
  }
}
