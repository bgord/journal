import * as Ports from "+emotions/ports";
import type * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewExportPdfFile extends bg.FileDraft {
  constructor(
    private readonly pdfGenerator: Ports.PdfGeneratorPort,
    private readonly data: {
      weeklyReview: Schema.SelectWeeklyReviews;
      entries: Schema.SelectEntries[];
      patterns: Schema.SelectPatternDetections[];
      alarms: Schema.SelectAlarms[];
    },
  ) {
    super({
      filename: `weekly-review-export-${data.weeklyReview.weekIsoId}.pdf`,
      mime: new tools.Mime("application/pdf"),
    });
  }

  // @ts-ignore
  create() {
    return this.pdfGenerator.request("weekly_review_export", this.data);
  }
}
