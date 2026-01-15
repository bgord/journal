import { useTranslations } from "@bgord/ui";
import { WeeklyReviewStatusEnum } from "../../app/services/weekly-review-form";
import type { DashboardDataType } from "../api";
import { Advice, DashboardDate } from "../components";
import { DashboardWeeklyReviewDownload } from "./dashboard-weekly-review-download";
import { DashboardWeeklyReviewEmailSend } from "./dashboard-weekly-review-email-send";

export function DashboardWeeklyReview(props: DashboardDataType["weeklyReviews"][number]) {
  const t = useTranslations();

  return (
    <li key={props.id} data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3" data-color="neutral-500">
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
        <div data-stack="x" data-cross="center" data-gap="2" data-fs="sm" data-color="neutral-300">
          <div className="c-badge" data-variant="primary">
            {props.entries.length}
          </div>
          {t("dashboard.weekly_review.entries.count")}
        </div>
      )}

      {props.status === WeeklyReviewStatusEnum.completed && props.patternDetections[0] && (
        <div data-stack="y" data-gap="2">
          <div>{t("dashboard.weekly_review.entries.patterns")}:</div>

          <ul data-stack="y" data-gap="2">
            {props.patternDetections.map((pattern) => (
              <li key={pattern.id} data-fs="sm" data-color="neutral-300">
                - {t(`pattern.${pattern.name}.name`)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {props.status === WeeklyReviewStatusEnum.completed && props.alarms[0] && (
        <div data-stack="y" data-gap="2">
          <div>{t("dashboard.weekly_review.entries.alarms")}:</div>

          <ul data-stack="y" data-gap="2">
            {props.alarms.map((alarm) => (
              <li key={alarm.id} data-fs="sm" data-color="neutral-300">
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
