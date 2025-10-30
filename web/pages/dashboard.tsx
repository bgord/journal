import { Rhythm, useTranslations } from "@bgord/ui";
import { Alarm, Calendar, Notes } from "iconoir-react";
import * as Sections from "../sections";

/** @public */
export function Dashboard() {
  const t = useTranslations();
  const column = Rhythm(450).times(1).style.width;

  return (
    <main data-stack="y" data-gap="8">
      <Sections.DashboardHeatmap />

      <div data-stack="x" data-gap="5" data-mx="auto" data-color="neutral-200">
        <section data-fs="sm" {...column}>
          <h2 data-stack="x" data-cross="center" data-gap="3" data-fw="regular" data-fs="base">
            <Alarm data-size="md" data-color="brand-300" /> {t("dashboard.alarm.header")}
          </h2>
          <Sections.DashboardAlarmsInactivity />
          <Sections.DashboardAlarmsEntry />
        </section>

        <section data-fs="sm" {...column}>
          <h2 data-stack="x" data-cross="center" data-gap="3" data-fw="regular" data-fs="base">
            <Notes data-size="md" data-color="brand-300" /> {t("dashboard.entries.header")}
          </h2>
          <Sections.DashboardEntryCounts />
          <Sections.DashboardEmotionsTop />
          <Sections.DashboardReactionsTop />
        </section>

        <section data-fs="sm" {...column}>
          <h2 data-stack="x" data-cross="center" data-gap="3" data-fw="regular" data-fs="base">
            <Calendar data-size="md" data-color="brand-300" /> {t("dashboard.weekly_reviews.header")}
          </h2>
          <Sections.DashboardWeeklyReviewList />
        </section>
      </div>
    </main>
  );
}
