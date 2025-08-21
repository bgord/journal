import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Emotions from "+emotions";

export class EntryExportFilePdf extends bg.FileDraft {
  constructor(
    private readonly pdfGenerator: Emotions.Ports.PdfGeneratorPort,
    private readonly entries: Emotions.VO.EntrySnapshot[],
  ) {
    // TODO: replace with tools
    super({ filename: `entry-export-${Date.now()}.pdf`, mime: new tools.Mime("application/pdf") });
  }

  // @ts-expect-error
  create() {
    return this.pdfGenerator.request("entry_export", { entries: this.entries });
  }
}
