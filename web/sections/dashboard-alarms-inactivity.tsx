import { useTranslations } from "@bgord/ui";
import { Advice, DashboardCell, DashboardCellEmpty, DashboardDate, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardAlarmsInactivity() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell>
      <DashboardSubheader>
        {t("dashboard.alarm.inactivity")}
        <div className="c-badge" data-variant="primary">
          {dashboard?.alarms.inactivity.length}
        </div>
      </DashboardSubheader>

      {!dashboard?.alarms.inactivity[0] && <DashboardCellEmpty />}

      {dashboard?.alarms.inactivity[0] && (
        <ul data-gap="6" data-stack="y">
          {dashboard?.alarms.inactivity.map((alarm) => (
            <li key={alarm.id}>
              <div data-gap="2" data-stack="x">
                <DashboardDate>{alarm.generatedAt}</DashboardDate>

                <div data-color="neutral-300">
                  {t("dashboard.alarm.inactivity.duration", {
                    inactivityDays: String(alarm.inactivityDays),
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
