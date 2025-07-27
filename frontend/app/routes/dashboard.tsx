import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import { guard } from "../../auth";
import * as Components from "../../components";
import { ReadModel } from "../../read-model";
import type { Route } from "./+types/dashboard";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await guard.getServerSession(request);
  const userId = session?.user.id as string;

  const heatmap = await ReadModel.getHeatmap(userId);
  const counts = await ReadModel.getEntryCounts(userId);
  const topEmotions = await ReadModel.getTopEmotions(userId);
  const topReactions = await ReadModel.getTopReactions(userId);
  const alarms = await ReadModel.listAlarms(userId);
  const weeklyReviews = await ReadModel.listWeeklyReviews(userId);

  return { alarms, entries: { counts, topEmotions, topReactions }, heatmap, weeklyReviews };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();

  return (
    <main data-disp="flex" data-dir="column">
      <ul data-disp="flex" data-p="5">
        {loaderData.heatmap.map((point, index) => (
          <li
            key={`heatmap-${point}-${index}`}
            data-bg={point ? "positive-500" : "danger-500"}
            data-size="xs"
          />
        ))}
      </ul>

      <a
        href={`${import.meta.env.VITE_API_URL}/entry/export`}
        download
        target="_blank"
        rel="noopener noreferer"
        data-ml="auto"
        data-mr="8"
        data-color="brand-500"
      >
        <Icons.DownloadCircle data-size="lg" />
      </a>

      <div data-disp="flex" data-gap="5" data-mx="auto" data-color="neutral-200" data-px="1">
        <section data-fs="sm" {...UI.Rhythm(450).times(1).style.width}>
          <h2 data-disp="flex" data-cross="center" data-gap="3">
            <Icons.Alarm data-size="md" data-color="brand-300" /> {t("dashboard.alarm.header")}
          </h2>

          <Components.DashboardCell data-mt="3">
            <h2 data-disp="flex" data-gap="3" data-fs="base">
              {t("dashboard.alarm.inactivity")}
              <div className="c-badge" data-variant="primary">
                {loaderData.alarms.inactivity.length}
              </div>
            </h2>

            {!loaderData.alarms.inactivity[0] && <div>{t("dashboard.alarm.inactivity.empty")}</div>}

            <ul data-disp="flex" data-dir="column" data-gap="8" data-mt="5">
              {loaderData.alarms.inactivity.map((alarm) => (
                <li key={alarm.id}>
                  <div data-disp="flex" data-gap="3">
                    <div data-fs="sm" data-color="neutral-500">
                      {alarm.generatedAt}
                    </div>

                    <div data-color="neutral-300">
                      {t("dashboard.alarm.inactivity.duration", {
                        inactivityDays: String(alarm.inactivityDays),
                      })}
                    </div>

                    <div data-ml="3" data-color="neutral-100">
                      "{alarm.advice}"
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Components.DashboardCell>

          <Components.DashboardCell data-mt="5">
            <h2 data-disp="flex" data-gap="3" data-fs="base">
              {t("dashboard.alarm.entry")}
              <div className="c-badge" data-variant="primary">
                {loaderData.alarms.entry.length}
              </div>
            </h2>

            {!loaderData.alarms.entry[0] && <div>Entry alarms will appear here</div>}

            <ul data-disp="flex" data-dir="column" data-gap="8" data-mt="5">
              {loaderData.alarms.entry.map((alarm) => (
                <li key={alarm.id}>
                  <div data-disp="flex" data-gap="3">
                    <div data-fs="sm" data-color="neutral-500">
                      {alarm.generatedAt}
                    </div>

                    <div data-color="neutral-300">
                      {t(`dashboard.alarm.entry.${alarm.name}.description`, {
                        emotionLabel: t(`entry.emotion.label.value.${alarm.emotionLabel}`),
                      })}
                    </div>

                    <div data-ml="3" data-color="neutral-100">
                      "{alarm.advice}"
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Components.DashboardCell>
        </section>

        <section data-fs="sm" {...UI.Rhythm(450).times(1).style.width}>
          <h2 data-disp="flex" data-cross="center" data-gap="3" data-fw="regular">
            <Icons.Notes data-size="md" data-color="brand-300" /> {t("dashboard.entries.header")}
          </h2>

          <Components.DashboardCell data-mt="3">
            <h2 data-disp="flex" data-gap="3" data-fs="base">
              {t("dashboard.entries.counts")}
            </h2>

            <div data-disp="flex" data-main="between" data-mt="5" data-px="8">
              <div data-disp="flex" data-dir="column" data-cross="center" data-gap="2">
                <div data-color="neutral-400" data-transform="center">
                  {t("dashboard.entries.today")}
                </div>
                <div data-fs="3xl" data-fw="bold">
                  {loaderData.entries.counts.today}
                </div>
              </div>

              <div data-disp="flex" data-dir="column" data-cross="center" data-gap="2">
                <div data-color="neutral-400" data-transform="center">
                  {t("dashboard.entries.last_week")}
                </div>
                <div data-fs="3xl" data-fw="bold">
                  {loaderData.entries.counts.lastWeek}
                </div>
              </div>

              <div data-disp="flex" data-dir="column" data-cross="center" data-gap="2">
                <div data-color="neutral-400" data-transform="center">
                  {t("dashboard.entries.all")}
                </div>
                <div data-fs="3xl" data-fw="bold">
                  {loaderData.entries.counts.all}
                </div>
              </div>
            </div>
          </Components.DashboardCell>

          {loaderData.entries.topEmotions.today[0] &&
            loaderData.entries.topEmotions.lastWeek[0] &&
            loaderData.entries.topEmotions.all[0] && (
              <Components.DashboardCell data-mt="5">
                <h2 data-disp="flex" data-gap="3" data-fs="base">
                  {t("dashboard.entries.top_emotions")}
                </h2>

                <div data-disp="flex" data-main="between" data-mt="5">
                  <div data-disp="flex" data-dir="column" data-cross="center" data-fs="sm">
                    <div data-color="neutral-400" data-transform="center">
                      {t("dashboard.entries.today")}
                    </div>

                    <ul data-disp="flex" data-dir="column" data-mt="3" data-gap="2">
                      {loaderData.entries.topEmotions.today.map((stat, index) => (
                        <li key={`top-emotions-today-${stat.hits}-${index}`} data-disp="flex" data-gap="2">
                          <div className="c-badge" data-variant="primary">
                            {stat.hits}
                          </div>
                          <div data-fs="xs">{t(`entry.emotion.label.value.${stat.label}`)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div data-disp="flex" data-dir="column" data-cross="center" data-fs="sm">
                    <div data-color="neutral-400" data-transform="center">
                      {t("dashboard.entries.last_week")}
                    </div>

                    <ul data-disp="flex" data-dir="column" data-mt="3" data-gap="2">
                      {loaderData.entries.topEmotions.lastWeek.map((stat, index) => (
                        <li key={`top-emotions-last-week-${stat}-${index}`} data-disp="flex" data-gap="2">
                          <div className="c-badge" data-variant="primary">
                            {stat.hits}
                          </div>
                          <div data-fs="xs">{t(`entry.emotion.label.value.${stat.label}`)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div data-disp="flex" data-dir="column" data-cross="center" data-fs="sm">
                    <div data-color="neutral-400" data-transform="center">
                      {t("dashboard.entries.all")}
                    </div>

                    <ul data-disp="flex" data-dir="column" data-mt="3" data-gap="2">
                      {loaderData.entries.topEmotions.all.map((stat, index) => (
                        <li key={`top-emotions-all-${stat}-${index}`} data-disp="flex" data-gap="2">
                          <div className="c-badge" data-variant="primary">
                            {stat.hits}
                          </div>
                          <div data-fs="xs">{t(`entry.emotion.label.value.${stat.label}`)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Components.DashboardCell>
            )}

          {loaderData.entries.topReactions[0] && (
            <Components.DashboardCell data-mt="5">
              <h2 data-disp="flex" data-gap="3" data-fs="base">
                {t("dashboard.entries.reactions")}
              </h2>

              <ul data-disp="flex" data-dir="column" data-mt="5" data-gap="5">
                {loaderData.entries.topReactions.map((reaction) => (
                  <li key={reaction.id} data-disp="flex" data-dir="column" data-gap="2">
                    <div data-disp="flex" data-gap="3">
                      <div className="c-badge" data-variant="primary">
                        {reaction.reactionEffectiveness} / 5
                      </div>

                      <div data-color="neutral-400">
                        {t(`entry.reaction.type.value.${reaction.reactionType}`)}
                      </div>
                    </div>

                    <div data-ml="3" data-color="neutral-100">
                      "{reaction.reactionDescription}"
                    </div>
                  </li>
                ))}
              </ul>
            </Components.DashboardCell>
          )}
        </section>

        <section data-fs="sm" {...UI.Rhythm(450).times(1).style.width}>
          <h2 data-disp="flex" data-cross="center" data-gap="3" data-fw="regular">
            <Icons.Calendar data-size="md" data-color="brand-300" /> {t("dashboard.weekly_reviews.header")}
          </h2>

          <Components.DashboardCell data-mt="3">
            <h2 data-disp="flex" data-fs="base">
              {t("dashboard.weekly_reviews.history")}
            </h2>

            <ul data-disp="flex" data-dir="column" data-mt="5">
              {loaderData.weeklyReviews.map((review) => (
                <li key={review.id} data-disp="flex" data-dir="column" data-gap="5">
                  <div data-disp="flex" data-main="between">
                    {review.week[0]} - {review.week[1]}
                    <div className="c-badge" data-variant="outline">
                      {t(`dashboard.weekly_review.status.${review.status}.value`)}
                    </div>
                  </div>

                  <div data-disp="flex" data-gap="2">
                    <div className="c-badge" data-variant="primary">
                      {review.entryCount}
                    </div>
                    {t("dashboard.weekly_review.entries.count")}
                  </div>

                  <div data-disp="flex" data-dir="column" data-gap="3">
                    <div data-fs="base">{t("dashboard.weekly_review.entries.patterns")}:</div>

                    <ul data-disp="flex" data-gap="2">
                      {review.patternDetections.map((pattern: any) => (
                        <li key={pattern.id} data-fs="sm" data-color="neutral-300">
                          - {t(`pattern.${pattern.name}.name`)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {review.status === "completed" && (
                    <div data-ml="3" data-color="neutral-100">
                      "{review.insights}"
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Components.DashboardCell>
        </section>
      </div>
    </main>
  );
}
