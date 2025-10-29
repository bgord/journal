import { SendMail } from "iconoir-react";
import type { DashboardDataType } from "../api";

export function DashboardWeeklyReviewEmailSend(props: DashboardDataType["weeklyReviews"][number]) {
  return (
    <form>
      <input type="hidden" name="intent" value="export_weekly_review_by_email" />
      <input type="hidden" name="weeklyReviewId" value={props.id} />
      <button type="submit" className="c-button" data-variant="bare" data-pt="2" data-color="brand-500">
        <SendMail data-size="lg" />
      </button>
    </form>
  );
}
