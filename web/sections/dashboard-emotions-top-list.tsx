import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardCellEmpty, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";
import { DashboardEmotionsTop } from "./dashboard-emotions-top";

export function DashboardEmotionsTopList() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  const top = dashboard?.entries.top.emotions;

  return (
    <DashboardCell>
      <DashboardSubheader>{t("dashboard.entries.top_emotions")}</DashboardSubheader>

      {!(top?.today[0] && top?.lastWeek[0] && top?.allTime[0]) && <DashboardCellEmpty />}

      {top?.today[0] && top?.lastWeek[0] && top?.allTime[0] && (
        <div data-stack="x" data-main="between">
          <DashboardEmotionsTop label={t("dashboard.entries.today")} emotions={top.today} />
          <DashboardEmotionsTop label={t("dashboard.entries.last_week")} emotions={top.lastWeek} />
          <DashboardEmotionsTop label={t("dashboard.entries.all")} emotions={top.allTime} />
        </div>
      )}
    </DashboardCell>
  );
}
