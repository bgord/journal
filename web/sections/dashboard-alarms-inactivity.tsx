import { useTranslations } from "@bgord/ui";
import { Advice, DashboardCell, DashboardSectionEmpty, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardAlarmsInactivity() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell data-mt="3">
      <DashboardSubheader>
        {t("dashboard.alarm.inactivity")}
        <div className="c-badge" data-variant="primary">
          {dashboard?.alarms.inactivity.length}
        </div>
      </DashboardSubheader>

      {!dashboard?.alarms.inactivity[0] && <DashboardSectionEmpty />}

      {dashboard?.alarms.inactivity[0] && (
        <ul data-stack="y" data-gap="5" data-mt="5">
          {dashboard?.alarms.inactivity.map((alarm) => (
            <li key={alarm.id} data-bct="neutral-800" data-bwt="hairline" data-pt="3">
              <div data-stack="x" data-gap="3">
                <div data-fs="sm" data-color="neutral-500">
                  {alarm.generatedAt}
                </div>

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
