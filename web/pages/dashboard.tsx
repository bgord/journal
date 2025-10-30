import { Rhythm, useTranslations } from "@bgord/ui";
import { Alarm, Calendar, Notes } from "iconoir-react";
import { DashboardColumnHeader } from "../components";
import * as Sections from "../sections";

/** @public */
export function Dashboard() {
  const t = useTranslations();
  const column = Rhythm(450).times(1).style.width;

  return (
    <main data-stack="y" data-gap="5">
      <Sections.DashboardHeatmap />

      <div data-stack="x" data-gap="5" data-mx="auto" data-color="neutral-200">
        <section data-stack="y" data-gap="5" data-fs="sm" {...column}>
          <DashboardColumnHeader>
            <Alarm data-size="md" data-color="brand-300" /> {t("dashboard.alarm.header")}
          </DashboardColumnHeader>
          <Sections.DashboardAlarmsInactivity />
          <Sections.DashboardAlarmsEntry />
        </section>

        <section data-stack="y" data-gap="5" data-fs="sm" {...column}>
          <DashboardColumnHeader>
            <Notes data-size="md" data-color="brand-300" /> {t("dashboard.entries.header")}
          </DashboardColumnHeader>
          <Sections.DashboardEntryCounts />
          <Sections.DashboardEmotionsTopList />
          <Sections.DashboardReactionsTop />
        </section>

        <section data-stack="y" data-gap="5" data-fs="sm" {...column}>
          <DashboardColumnHeader>
            <Calendar data-size="md" data-color="brand-300" /> {t("dashboard.weekly_reviews.header")}
          </DashboardColumnHeader>
          <Sections.DashboardWeeklyReviewList />
        </section>
      </div>
    </main>
  );
}
