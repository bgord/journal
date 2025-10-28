import { useTranslations } from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as Components from "../components";
import { dashboardRoute } from "../router";

export function DashboardAlarmsInactivity() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <Components.DashboardCell data-mt="3">
      <h2 data-stack="x" data-gap="3" data-fs="base">
        {t("dashboard.alarm.inactivity")}
        <div className="c-badge" data-variant="primary">
          {dashboard?.alarms.inactivity.length}
        </div>
      </h2>

      {!dashboard?.alarms.inactivity[0] && (
        <div data-mt="5" data-fs="sm" data-color="neutral-400">
          {t("dashboard.alarm.inactivity.empty")}
        </div>
      )}

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

                <div data-color="neutral-100">
                  <Icons.Sparks data-size="sm" data-color="brand-100" data-mr="1" /> "{alarm.advice}"
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Components.DashboardCell>
  );
}
