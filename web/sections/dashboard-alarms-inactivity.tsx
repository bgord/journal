import { useTranslations } from "@bgord/ui";
import * as UI from "../components";
import { dashboardRoute } from "../router";

export function DashboardAlarmsInactivity() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <UI.DashboardCell>
      <UI.DashboardSubheader>
        {t("dashboard.alarm.inactivity")}
        <div className="c-badge" data-variant="primary">
          {dashboard?.alarms.inactivity.length}
        </div>
      </UI.DashboardSubheader>

      {!dashboard?.alarms.inactivity[0] && <UI.DashboardCellEmpty />}

      {dashboard?.alarms.inactivity[0] && (
        <ul data-stack="y" data-gap="5">
          {dashboard?.alarms.inactivity.map((alarm) => (
            <li key={alarm.id} data-bct="neutral-800" data-bwt="hairline" data-pt="3">
              <div data-stack="x" data-gap="3">
                <UI.DashboardDate>{alarm.generatedAt}</UI.DashboardDate>

                <div data-color="neutral-300">
                  {t("dashboard.alarm.inactivity.duration", {
                    inactivityDays: String(alarm.inactivityDays),
                  })}
                </div>

                <UI.Advice>{alarm.advice}</UI.Advice>
              </div>
            </li>
          ))}
        </ul>
      )}
    </UI.DashboardCell>
  );
}
