import { useTranslations } from "@bgord/ui";
import { Alarm, Calendar, Notes } from "iconoir-react";
import { DashboardColumnHeader, DashboardSection } from "../components";
import * as Sections from "../sections";

/** @public */
export function Dashboard() {
  const t = useTranslations();

  return (
    <main data-stack="y" data-gap="5" data-mb="8">
      <Sections.DashboardHeatmap />

      <div data-stack="x" data-gap="5" data-mx="auto" data-color="neutral-200">
        <DashboardSection>
          <DashboardColumnHeader>
            <Alarm data-size="md" data-color="brand-300" /> {t("dashboard.alarm.header")}
          </DashboardColumnHeader>
          <Sections.DashboardAlarmsInactivity />
          <Sections.DashboardAlarmsEntry />
        </DashboardSection>

        <DashboardSection>
          <DashboardColumnHeader>
            <Notes data-size="md" data-color="brand-300" /> {t("dashboard.entries.header")}
          </DashboardColumnHeader>
          <Sections.DashboardEntryCounts />
          <Sections.DashboardEmotionsTopList />
          <Sections.DashboardReactionsTop />
        </DashboardSection>

        <DashboardSection>
          <DashboardColumnHeader>
            <Calendar data-size="md" data-color="brand-300" /> {t("dashboard.weekly_reviews.header")}
          </DashboardColumnHeader>
          <Sections.DashboardWeeklyReviewList />
        </DashboardSection>
      </div>
    </main>
  );
}
