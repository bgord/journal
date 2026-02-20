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
        <div data-main="between" data-stack="x">
          <DashboardEmotionsTop emotions={top.today} label={t("dashboard.entries.today")} />
          <DashboardEmotionsTop emotions={top.lastWeek} label={t("dashboard.entries.last_week")} />
          <DashboardEmotionsTop emotions={top.allTime} label={t("dashboard.entries.all")} />
        </div>
      )}
    </DashboardCell>
  );
}
