import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Emotions from "+emotions";

export class WeeklyReviewExportPdfFile extends bg.FileDraft {
  constructor(
    private readonly pdfGenerator: bg.PdfGeneratorPort,
    private readonly data: Emotions.Queries.WeeklyReviewExportDto,
  ) {
    super(tools.Basename.parse(`weekly-review-export-${data.weekIsoId}`), tools.MIMES.pdf);
  }

  // @ts-expect-error
  create() {
    return this.pdfGenerator.request("weekly_review_export", this.data);
  }
}
