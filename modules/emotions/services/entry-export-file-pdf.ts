import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Emotions from "+emotions";

type Dependencies = { PdfGenerator: bg.PdfGeneratorPort; Clock: bg.ClockPort };

export class EntryExportFilePdf extends bg.FileDraft {
  constructor(
    private readonly entries: ReadonlyArray<Emotions.VO.EntrySnapshot>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `entry-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "pdf"),
      tools.Mimes.pdf.mime,
    );
  }

  async create() {
    return this.deps.PdfGenerator.request("entry_export", { entries: this.entries });
  }
}
