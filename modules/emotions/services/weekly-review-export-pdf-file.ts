import * as Ports from "+emotions/ports";
import type * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

// TODO: tests
export class WeeklyReviewExportPdfFile extends bg.FileDraft {
  constructor(
    private readonly pdfGenerator: Ports.PdfGeneratorPort,
    private readonly weeklyReview: Schema.SelectWeeklyReviews,
  ) {
    super({
      filename: `weekly-review-export-${weeklyReview.weekIsoId}.pdf`,
      mime: new tools.Mime("application/pdf"),
    });
  }

  create() {
    return this.pdfGenerator.request("weekly_review_export.html", this.weeklyReview);
  }

  // TODO: migrate to bgord/bun
  async toAttachment() {
    const body = await this.create();

    return { filename: this.config.filename, content: body, contentType: this.config.mime.raw };
  }
}
