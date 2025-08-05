import * as Ports from "+emotions/ports";
import * as Queries from "+emotions/queries";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewExportPdfFile extends bg.FileDraft {
  constructor(
    private readonly pdfGenerator: Ports.PdfGeneratorPort,
    private readonly data: Queries.WeeklyReviewExportDto,
  ) {
    super({
      filename: `weekly-review-export-${data.weekIsoId}.pdf`,
      mime: new tools.Mime("application/pdf"),
    });
  }

  // @ts-ignore
  create() {
    return this.pdfGenerator.request("weekly_review_export", this.data);
  }
}
