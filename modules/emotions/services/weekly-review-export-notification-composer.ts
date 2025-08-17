import * as tools from "@bgord/tools";
import type * as Queries from "+emotions/queries";

export class WeeklyReviewExportNotificationComposer {
  compose(weeklyReview: Queries.WeeklyReviewExportDto): tools.NotificationTemplate {
    const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);
    return new tools.NotificationTemplate(`Weekly Review PDF - ${week.getStart()}`, "Find the file attached");
  }
}
