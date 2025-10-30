import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardSectionEmpty, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";
import { DashboardWeeklyReview } from "./dashboard-weekly-review";

export function DashboardWeeklyReviewList() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell data-mt="3">
      <DashboardSubheader>{t("dashboard.weekly_reviews.history")}</DashboardSubheader>

      {!dashboard?.weeklyReviews[0] && <DashboardSectionEmpty />}

      {dashboard?.weeklyReviews[0] && (
        <ul data-stack="y" data-gap="8" data-mt="5">
          {dashboard?.weeklyReviews.map((review) => (
            <DashboardWeeklyReview key={review.id} {...review} />
          ))}
        </ul>
      )}
    </DashboardCell>
  );
}
