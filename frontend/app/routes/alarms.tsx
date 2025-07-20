import * as UI from "@bgord/ui";
import { Alarm as AlarmIcon } from "iconoir-react";
import type { SelectAlarms } from "../../../infra/schema";
import { API } from "../../api";
import type { Route } from "./+types/alarms";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = UI.Cookies.extractFrom(request);

  const response = await API("/alarm/list", { headers: { cookie } });
  const alarms = (await response.json()) as SelectAlarms[];

  return { alarms };
}

export default function Alarms(props: Route.ComponentProps) {
  const t = UI.useTranslations();

  return (
    <main data-pb="36" data-fs="14" data-max-width="768" data-width="100%" data-mx="auto">
      <h1 data-mb="24">
        {t("alarm.header")} <AlarmIcon height={20} width={20} data-color="red-500" />
      </h1>

      <div
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-p="48"
        data-pt="36"
        data-bc="gray-200"
        data-bw="1"
        data-br="4"
        data-shadow="sm"
        {...UI.Colorful("surface-card").style.background}
      >
        <h2 data-display="flex" data-gap="12">
          {t("alarm.inactivity")}
          <div className="c-badge">{props.loaderData.alarms.length}</div>
        </h2>

        <ul data-display="flex" data-direction="column" data-gap="6" data-mt="12">
          {props.loaderData.alarms.map((alarm) => (
            <li key={alarm.id}>
              <div data-display="flex" data-gap="12">
                <div>{alarm.generatedAt}</div>

                <div {...UI.Colorful("brand-600").style.color}>
                  {t("alarm.inactivity.duration", { inactivityDays: String(alarm.inactivityDays) })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
