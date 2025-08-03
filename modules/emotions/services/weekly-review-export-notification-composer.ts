import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";

export class WeeklyReviewExportNotificationComposer {
  compose(weeklyReview: Schema.SelectWeeklyReviews): VO.NotificationTemplate {
    const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);
    return new VO.NotificationTemplate(`Weekly Review PDF - ${week.getStart()}`, "Find the file attached");
  }
}
