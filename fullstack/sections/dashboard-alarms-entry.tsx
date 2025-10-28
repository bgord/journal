import { useTranslations } from "@bgord/ui";
import { Sparks } from "iconoir-react";
import * as Components from "../components";
import { dashboardRoute } from "../router";

export function DashboardAlarmsEntry() {
  const t = useTranslations();
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <Components.DashboardCell data-mt="5">
      <h2 data-stack="x" data-gap="3" data-fs="base">
        {t("dashboard.alarm.entry")}
        <div className="c-badge" data-variant="primary">
          {dashboard?.alarms.entry.length}
        </div>
      </h2>

      {!dashboard?.alarms.entry[0] && (
        <div data-mt="5" data-fs="sm" data-color="neutral-400">
          {t("dashboard.alarm.entries.empty")}
        </div>
      )}

      {dashboard?.alarms.entry[0] && (
        <ul data-stack="y" data-gap="5" data-mt="5">
          {dashboard?.alarms.entry.map((alarm) => (
            <li key={alarm.id} data-bct="neutral-800" data-bwt="hairline" data-pt="3">
              <div data-stack="x" data-gap="3">
                <div data-fs="sm" data-color="neutral-500">
                  {alarm.generatedAt}
                </div>

                <div data-color="neutral-300">
                  {t(`dashboard.alarm.entry.${alarm.name}.description`, {
                    emotionLabel: t(`entry.emotion.label.value.${alarm.emotionLabel}`),
                  })}
                </div>

                <div data-color="neutral-100">
                  <Sparks data-size="sm" data-color="brand-100" data-mr="1" /> "{alarm.advice}"
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Components.DashboardCell>
  );
}
