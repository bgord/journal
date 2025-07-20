import * as UI from "@bgord/ui";
import { Alarm as AlarmIcon, Notes } from "iconoir-react";
import type { SelectAlarms, SelectEntries } from "../../../infra/schema";
import { API } from "../../api";
import { guard } from "../../auth";
import { Repo } from "../../repos";
import type { Route } from "./+types/dashboard";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await guard.getServerSession(request);
  const userId = session?.user.id as string;

  const cookie = UI.Cookies.extractFrom(request);

  const response = await API("/dashboard/list", { headers: { cookie } });
  const json = await response.json();

  const alarms = json.alarms as { inactivity: SelectAlarms[]; entry: SelectAlarms[] };

  // TODO: Make typesafe
  const entries = json.entries as {
    topReactions: Pick<SelectEntries, "reactionType" | "reactionDescription" | "reactionEffectiveness">[];
  };

  const heatmap = await Repo.getHeatmap(userId);
  const counts = await Repo.getCounts(userId);
  const topEmotions = await Repo.getTopEmotions(userId);

  return { alarms, entries: { ...entries, counts, topEmotions }, heatmap };
}

function Cell(props: React.JSX.IntrinsicElements["div"]) {
  return (
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
      {...props}
    />
  );
}

export default function Dashboard(props: Route.ComponentProps) {
  const t = UI.useTranslations();

  return (
    <main data-display="flex" data-direction="column">
      <ul data-display="flex" data-p="12" data-ml="6">
        {props.loaderData.heatmap.map((point) => (
          <li data-bg={point ? "green-400" : "red-400"} {...UI.Rhythm(6).times(1).style.square} />
        ))}
      </ul>

      <div data-display="flex">
        <section data-p="12" data-fs="12" {...UI.Rhythm(475).times(1).style.width}>
          <h2 data-display="flex" data-gap="12" data-mb="12" data-ml="6">
            <AlarmIcon height={20} width={20} data-color="red-500" /> {t("dashboard.alarm.header")}
          </h2>

          <Cell>
            <h2 data-display="flex" data-gap="12">
              {t("dashboard.alarm.inactivity")}
              <div className="c-badge">{props.loaderData.alarms.inactivity.length}</div>
            </h2>

            <ul data-display="flex" data-direction="column" data-gap="12" data-mt="12">
              {props.loaderData.alarms.inactivity.map((alarm) => (
                <li key={alarm.id}>
                  <div data-display="flex" data-gap="6">
                    <div>{alarm.generatedAt}</div>

                    <div {...UI.Colorful("brand-600").style.color}>
                      {t("dashboard.alarm.inactivity.duration", {
                        inactivityDays: String(alarm.inactivityDays),
                      })}
                    </div>

                    <div data-ml="12">"{alarm.advice}"</div>
                  </div>
                </li>
              ))}
            </ul>
          </Cell>

          <Cell data-mt="24">
            <h2 data-display="flex" data-gap="12">
              {t("dashboard.alarm.entry")}
              <div className="c-badge">{props.loaderData.alarms.entry.length}</div>
            </h2>

            <ul data-display="flex" data-direction="column" data-gap="12" data-mt="12">
              {props.loaderData.alarms.entry.map((alarm) => (
                <li key={alarm.id}>
                  <div data-display="flex" data-gap="6">
                    <div>{alarm.generatedAt}</div>

                    <div {...UI.Colorful("brand-600").style.color}>
                      {t(`dashboard.alarm.entry.${alarm.name}.description`, {
                        emotionLabel: t(`entry.emotion.label.value.${alarm.emotionLabel}`),
                      })}
                    </div>

                    <div data-ml="12">"{alarm.advice}"</div>
                  </div>
                </li>
              ))}
            </ul>
          </Cell>
        </section>

        <section data-pb="36" data-fs="12" data-p="12" {...UI.Rhythm(475).times(1).style.width}>
          <h2 data-display="flex" data-gap="12" data-mb="12" data-ml="6">
            <Notes height={20} width={20} data-color="green-500" /> {t("dashboard.entries.header")}
          </h2>

          <Cell>
            <h2 data-display="flex" data-gap="12">
              {t("dashboard.entries.counts")}
            </h2>

            <div data-display="flex" data-main="between" data-px="36">
              <div data-display="flex" data-direction="column" data-cross="center" data-gap="12">
                <div data-transform="center">{t("dashboard.entries.today")}</div>
                <div data-fs="36" {...UI.Colorful("brand-500").style.color}>
                  {props.loaderData.entries.counts.today}
                </div>
              </div>

              <div data-display="flex" data-direction="column" data-cross="center" data-gap="12">
                <div data-transform="center">{t("dashboard.entries.last_week")}</div>
                <div data-fs="36" {...UI.Colorful("brand-500").style.color}>
                  {props.loaderData.entries.counts.lastWeek}
                </div>
              </div>

              <div data-display="flex" data-direction="column" data-cross="center" data-gap="12">
                <div data-transform="center">{t("dashboard.entries.all")}</div>
                <div data-fs="36" {...UI.Colorful("brand-500").style.color}>
                  {props.loaderData.entries.counts.all}
                </div>
              </div>
            </div>
          </Cell>

          <Cell data-mt="24">
            <h2 data-display="flex" data-gap="12">
              {t("dashboard.entries.top_emotions")}
            </h2>

            <div data-display="flex" data-main="between" data-px="12">
              <div data-display="flex" data-direction="column" data-cross="center" data-gap="12" data-fs="12">
                <div>{t("dashboard.entries.today")}</div>

                <ul data-display="flex" data-direction="column" data-gap="24">
                  {props.loaderData.entries.topEmotions.today.map((stat) => (
                    <li data-display="flex" data-gap="6">
                      <div className="c-badge">{stat.hits}</div>
                      <div>{t(`entry.emotion.label.value.${stat.label}`)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-display="flex" data-direction="column" data-cross="center" data-gap="12" data-fs="12">
                <div>{t("dashboard.entries.last_week")}</div>

                <ul data-display="flex" data-direction="column" data-gap="24">
                  {props.loaderData.entries.topEmotions.lastWeek.map((stat) => (
                    <li data-display="flex" data-gap="6">
                      <div className="c-badge">{stat.hits}</div>
                      <div>{t(`entry.emotion.label.value.${stat.label}`)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-display="flex" data-direction="column" data-cross="center" data-gap="12" data-fs="12">
                <div>{t("dashboard.entries.all")}</div>

                <ul data-display="flex" data-direction="column" data-gap="24">
                  {props.loaderData.entries.topEmotions.all.map((stat) => (
                    <li data-display="flex" data-gap="6">
                      <div className="c-badge">{stat.hits}</div>
                      <div>{t(`entry.emotion.label.value.${stat.label}`)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Cell>

          <Cell data-mt="24">
            <h2 data-display="flex" data-gap="12">
              {t("dashboard.entries.reactions")}
            </h2>

            <ul data-display="flex" data-direction="column" data-gap="24">
              {props.loaderData.entries.topReactions.map((reaction) => (
                <li data-display="flex" data-direction="column" data-gap="12">
                  <div data-display="flex" data-gap="12">
                    <div className="c-badge">{reaction.reactionEffectiveness} / 5</div>
                    <div>{t(`entry.reaction.type.value.${reaction.reactionType}`)}</div>
                  </div>
                  <div data-ml="12">"{reaction.reactionDescription}"</div>
                </li>
              ))}
            </ul>
          </Cell>
        </section>
      </div>
    </main>
  );
}
