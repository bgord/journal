import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardCount, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardEntryCounts() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell data-mt="3">
      <DashboardSubheader>{t("dashboard.entries.counts")}</DashboardSubheader>

      <div data-stack="x" data-main="between" data-px="8">
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
