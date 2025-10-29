import { useTranslations } from "@bgord/ui";
import { DownloadCircle, SendMail, Sparks } from "iconoir-react";
import * as Components from "../components";
import { dashboardRoute } from "../router";

export function DashboardWeeklyReviewList() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <Components.DashboardCell data-mt="3">
      <h2 data-stack="x" data-fs="base">
        {t("dashboard.weekly_reviews.history")}
      </h2>

      {!dashboard?.weeklyReviews[0] && (
        <div data-mt="5" data-fs="sm" data-color="neutral-400">
          {t("dashboard.weekly_reviews.empty")}
        </div>
      )}

      {dashboard?.weeklyReviews[0] && (
        <ul data-stack="y" data-gap="8" data-mt="5">
          {dashboard?.weeklyReviews.map((review) => (
            <li key={review.id} data-stack="y" data-gap="5">
              <div data-stack="x" data-cross="center" data-gap="4" data-color="neutral-500">
                <div data-mr="auto">
                  {review.weekStart} - {review.weekEnd}
                </div>
                {review.status === "completed" && (
                  <>
                    <a
                      href={`/weekly-review/${review.id}/export/download`}
                      download
                      target="_blank"
                      data-pt="2"
                      data-color="brand-500"
                    >
                      <DownloadCircle data-size="lg" />
                    </a>

                    <form method="POST" action=".">
                      <input type="hidden" name="intent" value="export_weekly_review_by_email" />
                      <input type="hidden" name="weeklyReviewId" value={review.id} />
                      <button
                        type="submit"
                        className="c-button"
                        data-variant="bare"
                        data-pt="2"
                        data-color="brand-500"
                      >
                        <SendMail data-size="lg" />
                      </button>
                    </form>
                  </>
                )}
                <div className="c-badge" data-variant="outline">
                  {t(`dashboard.weekly_review.status.${review.status}.value`)}
                </div>
              </div>

              <div data-stack="x" data-gap="2" data-fs="sm">
                <div className="c-badge" data-variant="primary">
                  {review.entries.length}
                </div>
                {t("dashboard.weekly_review.entries.count")}
              </div>

              {review.status === "completed" && (
                <div data-stack="y" data-gap="3">
                  <div data-fs="base">{t("dashboard.weekly_review.entries.patterns")}:</div>

                  <ul data-stack="y" data-gap="2">
                    {review.patternDetections.map((pattern) => (
                      <li key={pattern.id} data-fs="sm" data-color="neutral-300">
                        - {t(`pattern.${pattern.name}.name`)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.status === "completed" && (
                <div data-stack="y" data-gap="3">
                  <div data-fs="base">{t("dashboard.weekly_review.entries.alarms")}:</div>

                  <ul data-stack="y" data-gap="2">
                    {review.alarms.map((alarm) => (
                      <li key={alarm.id} data-fs="sm" data-color="neutral-300">
                        - {t(`alarm.name.${alarm.name}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.status === "completed" && (
                <div data-stack="y" data-gap="3">
                  <div data-fs="base">{t("dashboard.weekly_review.insights")}:</div>

                  <div data-color="neutral-100">
                    <Sparks data-size="sm" data-color="brand-100" data-mr="1" /> "{review.insights}"
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Components.DashboardCell>
  );
}
