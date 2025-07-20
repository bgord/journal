import * as UI from "@bgord/ui";
import { Alarm as AlarmIcon } from "iconoir-react";
import type { SelectAlarms } from "../../../infra/schema";
import { API } from "../../api";
import type { Route } from "./+types/dashboard";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = UI.Cookies.extractFrom(request);

  const response = await API("/dashboard/list", { headers: { cookie } });
  const alarms = (await response.json()) as { inactivity: SelectAlarms[]; entry: SelectAlarms[] };

  return { alarms };
}

export default function Dashboard(props: Route.ComponentProps) {
  const t = UI.useTranslations();

  return (
    <main data-pb="36" data-fs="12" data-p="12" {...UI.Rhythm(475).times(1).style.width}>
      <h2 data-mb="12">
        {t("alarm.header")} <AlarmIcon height={20} width={20} data-color="red-500" />
      </h2>

      <div
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-p="24"
        data-bc="gray-200"
        data-bw="1"
        data-br="4"
        data-shadow="sm"
        {...UI.Colorful("surface-card").style.background}
      >
        <h2 data-display="flex" data-gap="12">
          {t("alarm.inactivity")}
          <div className="c-badge">{props.loaderData.alarms.inactivity.length}</div>
        </h2>

        <ul data-display="flex" data-direction="column" data-gap="12" data-mt="12">
          {props.loaderData.alarms.inactivity.map((alarm) => (
            <li key={alarm.id}>
              <div data-display="flex" data-gap="6">
                <div>{alarm.generatedAt}</div>

                <div {...UI.Colorful("brand-600").style.color}>
                  {t("alarm.inactivity.duration", { inactivityDays: String(alarm.inactivityDays) })}
                </div>

                <div data-ml="12">"{alarm.advice}"</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-mt="24"
        data-p="24"
        data-bc="gray-200"
        data-bw="1"
        data-br="4"
        data-shadow="sm"
        {...UI.Colorful("surface-card").style.background}
      >
        <h2 data-display="flex" data-gap="12">
          {t("alarm.entry")}
          <div className="c-badge">{props.loaderData.alarms.entry.length}</div>
        </h2>

        <ul data-display="flex" data-direction="column" data-gap="12" data-mt="12">
          {props.loaderData.alarms.entry.map((alarm) => (
            <li key={alarm.id}>
              <div data-display="flex" data-gap="6">
                <div>{alarm.generatedAt}</div>

                <div {...UI.Colorful("brand-600").style.color}>
                  {t(`alarm.entry.${alarm.name}.description`, {
                    emotionLabel: t(`entry.emotion.label.value.${alarm.emotionLabel}`),
                  })}
                </div>

                <div data-ml="12">"{alarm.advice}"</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
