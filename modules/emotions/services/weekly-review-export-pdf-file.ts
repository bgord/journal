import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Emotions from "+emotions";

type Dependencies = { PdfGenerator: bg.PdfGeneratorPort };

export class WeeklyReviewExportPdfFile extends bg.FileDraft {
  constructor(
    private readonly data: Emotions.Queries.WeeklyReviewExportDto,
    private readonly deps: Dependencies,
  ) {
    super(
      tools.Basename.parse(`weekly-review-export-${data.weekIsoId}`),
      tools.Extension.parse("pdf"),
      tools.Mimes.pdf.mime,
    );
  }

  // @ts-expect-error
  create() {
    return this.deps.PdfGenerator.request("weekly_review_export", this.data);
  }
}
