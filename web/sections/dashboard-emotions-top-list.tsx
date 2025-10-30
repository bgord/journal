import { useTranslations } from "@bgord/ui";
import { DashboardCell, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardEmotionsTopList() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  const top = dashboard?.entries.top.emotions;

  if (!((top?.today || top?.lastWeek) && top.allTime)) return null;

  return (
    <DashboardCell data-mt="5">
      <DashboardSubheader>{t("dashboard.entries.top_emotions")}</DashboardSubheader>

      <div data-stack="x" data-main="between" data-mt="5">
        {top.today[0] && (
          <div data-stack="y" data-cross="center" data-fs="sm">
            <div data-color="neutral-500" data-transform="center">
              {t("dashboard.entries.today")}
            </div>

            <ul data-stack="y" data-mt="3" data-gap="2">
              {dashboard?.entries.top.emotions.today.map((stat, index) => (
                <li key={`top-emotions-today-${stat.hits}-${index}`} data-stack="x" data-gap="2">
                  <div className="c-badge" data-variant="primary">
                    {stat.hits}
                  </div>
                  <div data-fs="xs">{t(`entry.emotion.label.value.${stat.emotionLabel}`)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {top.lastWeek[0] && (
          <div data-stack="y" data-cross="center" data-fs="sm">
            <div data-color="neutral-500" data-transform="center">
              {t("dashboard.entries.last_week")}
            </div>

            <ul data-stack="y" data-mt="3" data-gap="2">
              {dashboard?.entries.top.emotions.lastWeek.map((stat, index) => (
                <li key={`top-emotions-last-week-${stat}-${index}`} data-stack="x" data-gap="2">
                  <div className="c-badge" data-variant="primary">
                    {stat.hits}
                  </div>
                  <div data-fs="xs">{t(`entry.emotion.label.value.${stat.emotionLabel}`)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {top.allTime[0] && (
          <div data-stack="y" data-cross="center" data-fs="sm">
            <div data-color="neutral-500" data-transform="center">
              {t("dashboard.entries.all")}
            </div>

            <ul data-stack="y" data-mt="3" data-gap="2">
              {dashboard?.entries.top.emotions.allTime.map((stat, index) => (
                <li key={`top-emotions-all-${stat}-${index}`} data-stack="x" data-gap="2">
                  <div className="c-badge" data-variant="primary">
                    {stat.hits}
                  </div>
                  <div data-fs="xs">{t(`entry.emotion.label.value.${stat.emotionLabel}`)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardCell>
  );
}
