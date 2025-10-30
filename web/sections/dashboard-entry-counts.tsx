import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardCount } from "../components";
import { dashboardRoute } from "../router";

export function DashboardEntryCounts() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell data-mt="3">
      <h2 data-stack="x" data-gap="3" data-fs="base">
        {t("dashboard.entries.counts")}
      </h2>

      <div data-stack="x" data-main="between" data-mt="5" data-px="8">
        <DashboardCount label={t("dashboard.entries.today")}>
          {dashboard?.entries.counts.today}
        </DashboardCount>

        <DashboardCount label={t("dashboard.entries.last_week")}>
          {dashboard?.entries.counts.lastWeek}
        </DashboardCount>

        <DashboardCount label={t("dashboard.entries.all")}>
          {dashboard?.entries.counts.allTime}
        </DashboardCount>
      </div>
    </DashboardCell>
  );
}
