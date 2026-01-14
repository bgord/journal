import { useTranslations } from "@bgord/ui";
import { Advice, DashboardCell, DashboardCellEmpty, DashboardDate, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardAlarmsEntry() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell>
      <DashboardSubheader>
        {t("dashboard.alarm.entry")}
        <div className="c-badge" data-variant="primary">
          {dashboard?.alarms.entry.length}
        </div>
      </DashboardSubheader>

      {!dashboard?.alarms.entry[0] && <DashboardCellEmpty />}

      {dashboard?.alarms.entry[0] && (
        <ul data-stack="y" data-gap="5">
          {dashboard?.alarms.entry.map((alarm) => (
            <li key={alarm.id} data-pt="3">
              <div data-stack="x" data-gap="3">
                <DashboardDate>{alarm.generatedAt}</DashboardDate>

                <div data-color="neutral-300">
                  {t(`dashboard.alarm.entry.${alarm.name}.description`, {
                    emotionLabel: t(`entry.emotion.label.value.${alarm.emotionLabel}`),
                  })}
                </div>

                <Advice>{alarm.advice}</Advice>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCell>
  );
}
