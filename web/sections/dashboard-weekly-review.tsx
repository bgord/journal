import { useTranslations } from "@bgord/ui";
import { WeeklyReviewStatusEnum } from "../../app/services/weekly-review-form";
import type { DashboardDataType } from "../api";
import { Advice, DashboardDate } from "../components";
import { DashboardWeeklyReviewDownload } from "./dashboard-weekly-review-download";
import { DashboardWeeklyReviewEmailSend } from "./dashboard-weekly-review-email-send";

export function DashboardWeeklyReview(props: DashboardDataType["weeklyReviews"][number]) {
  const t = useTranslations();

  return (
    <li data-gap="5" data-stack="y" key={props.id}>
      <div data-color="neutral-500" data-cross="center" data-gap="3" data-stack="x">
        <DashboardDate data-mr="auto">
          {props.weekStart} - {props.weekEnd}
        </DashboardDate>

        {props.status === WeeklyReviewStatusEnum.completed && (
          <>
            <DashboardWeeklyReviewDownload {...props} />
            <DashboardWeeklyReviewEmailSend {...props} />
          </>
        )}
        <div className="c-badge" data-variant="outline">
          {t(`dashboard.weekly_review.status.${props.status}.value`)}
        </div>
      </div>

      {props.status === WeeklyReviewStatusEnum.completed && (
        <div data-color="neutral-300" data-cross="center" data-fs="sm" data-gap="2" data-stack="x">
          <div className="c-badge" data-variant="primary">
            {props.entries.length}
          </div>
          {t("dashboard.weekly_review.entries.count")}
        </div>
      )}

      {props.status === WeeklyReviewStatusEnum.completed && props.patternDetections[0] && (
        <div data-gap="2" data-stack="y">
          <div>{t("dashboard.weekly_review.entries.patterns")}:</div>

          <ul data-gap="2" data-stack="y">
            {props.patternDetections.map((pattern) => (
              <li data-color="neutral-300" data-fs="sm" key={pattern.id}>
                - {t(`pattern.${pattern.name}.name`)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {props.status === WeeklyReviewStatusEnum.completed && props.alarms[0] && (
        <div data-gap="2" data-stack="y">
          <div>{t("dashboard.weekly_review.entries.alarms")}:</div>

          <ul data-gap="2" data-stack="y">
            {props.alarms.map((alarm) => (
              <li data-color="neutral-300" data-fs="sm" key={alarm.id}>
                - {t(`alarm.name.${alarm.name}`)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {props.status === WeeklyReviewStatusEnum.completed && <Advice>{props.insights}</Advice>}
    </li>
  );
}
