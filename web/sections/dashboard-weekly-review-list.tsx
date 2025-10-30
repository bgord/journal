import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardCellEmpty, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";
import { DashboardWeeklyReview } from "./dashboard-weekly-review";

export function DashboardWeeklyReviewList() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell>
      <DashboardSubheader>{t("dashboard.weekly_reviews.history")}</DashboardSubheader>

      {!dashboard?.weeklyReviews[0] && <DashboardCellEmpty />}

      {dashboard?.weeklyReviews[0] && (
        <ul data-stack="y" data-gap="5">
          {dashboard?.weeklyReviews.map((review) => (
            <DashboardWeeklyReview key={review.id} {...review} />
          ))}
        </ul>
      )}
    </DashboardCell>
  );
}
