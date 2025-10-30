import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";
import { DashboardEmotionsTop } from "./dashboard-emotions-top";

export function DashboardEmotionsTopList() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  const top = dashboard?.entries.top.emotions;

  if (!((top?.today || top?.lastWeek) && top.allTime)) return null;

  return (
    <DashboardCell>
      <DashboardSubheader>{t("dashboard.entries.top_emotions")}</DashboardSubheader>

      <div data-stack="x" data-main="between">
        {top.today[0] && <DashboardEmotionsTop label={t("dashboard.entries.today")} emotions={top.today} />}
        {top.lastWeek[0] && (
          <DashboardEmotionsTop label={t("dashboard.entries.last_week")} emotions={top.lastWeek} />
        )}
        {top.allTime[0] && <DashboardEmotionsTop label={t("dashboard.entries.all")} emotions={top.allTime} />}
      </div>
    </DashboardCell>
  );
}
