import * as tools from "@bgord/tools";
import type * as Schema from "+infra/schema";

export class WeeklyReviewExportNotificationComposer {
  compose(weeklyReview: Schema.SelectWeeklyReviews): tools.NotificationTemplate {
    const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);
    return new tools.NotificationTemplate(`Weekly Review PDF - ${week.getStart()}`, "Find the file attached");
  }
}
