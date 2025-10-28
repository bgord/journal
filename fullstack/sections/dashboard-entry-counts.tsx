import { useTranslations } from "@bgord/ui";
import * as Components from "../components";
import { dashboardRoute } from "../router";

export function DashboardEntryCounts() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <Components.DashboardCell data-mt="3">
      <h2 data-stack="x" data-gap="3" data-fs="base">
        {t("dashboard.entries.counts")}
      </h2>

      <div data-stack="x" data-main="between" data-mt="5" data-px="8">
        <div data-stack="y" data-cross="center" data-gap="2">
          <div data-color="neutral-500" data-transform="center">
            {t("dashboard.entries.today")}
          </div>
          <div data-fs="3xl" data-fw="bold">
            {dashboard?.entries.counts.today}
          </div>
        </div>

        <div data-stack="y" data-cross="center" data-gap="2">
          <div data-color="neutral-500" data-transform="center">
            {t("dashboard.entries.last_week")}
          </div>
          <div data-fs="3xl" data-fw="bold">
            {dashboard?.entries.counts.lastWeek}
          </div>
        </div>

        <div data-stack="y" data-cross="center" data-gap="2">
          <div data-color="neutral-500" data-transform="center">
            {t("dashboard.entries.all")}
          </div>
          <div data-fs="3xl" data-fw="bold">
            {dashboard?.entries.counts.allTime}
          </div>
        </div>
      </div>
    </Components.DashboardCell>
  );
}
