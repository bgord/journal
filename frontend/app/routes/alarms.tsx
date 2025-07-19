import * as UI from "@bgord/ui";
import type { SelectAlarms } from "../../../infra/schema";
import { API } from "../../api";
import type { Route } from "./+types/alarms";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = UI.Cookies.extractFrom(request);

  const response = await API("/alarm/list", {
    headers: { cookie },
  });
  console.log(response.status);

  const alarms = (await response.json()) as SelectAlarms[];
  console.log(alarms);

  return { alarms };
}

export default function Alarms({ loaderData }: Route.ComponentProps) {
  return (
    <main data-pb="36">
      <header>Alarms</header>

      <ul>
        {loaderData.alarms.map((alarm) => (
          <li key={alarm.id}>{alarm.name}</li>
        ))}
      </ul>
    </main>
  );
}
