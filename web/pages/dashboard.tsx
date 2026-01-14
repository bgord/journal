import { useTranslations } from "@bgord/ui";
import { Alarm, Calendar, Notes } from "iconoir-react";
import { DashboardColumnHeader, DashboardSection } from "../components";
import {
  DashboardAlarmsEntry,
  DashboardAlarmsInactivity,
  DashboardEmotionsTopList,
  DashboardEntryCounts,
  DashboardHeatmap,
  DashboardReactionsTop,
  DashboardWeeklyReviewList,
} from "../sections";

/** @public */
export function Dashboard() {
  const t = useTranslations();

  return (
    <main data-stack="y" data-gap="5" data-mb="8" data-md-m="2">
      <DashboardHeatmap />

      <div data-stack="x" data-gap="5" data-mx="auto">
        <DashboardSection>
          <DashboardColumnHeader>
            <Alarm data-size="md" data-color="brand-300" /> {t("dashboard.alarm.header")}
          </DashboardColumnHeader>
          <DashboardAlarmsInactivity />
          <DashboardAlarmsEntry />
        </DashboardSection>

        <DashboardSection>
          <DashboardColumnHeader>
            <Notes data-size="md" data-color="brand-300" /> {t("dashboard.entries.header")}
          </DashboardColumnHeader>
          <DashboardEntryCounts />
          <DashboardEmotionsTopList />
          <DashboardReactionsTop />
        </DashboardSection>

        <DashboardSection>
          <DashboardColumnHeader>
            <Calendar data-size="md" data-color="brand-300" /> {t("dashboard.weekly_reviews.header")}
          </DashboardColumnHeader>
          <DashboardWeeklyReviewList />
        </DashboardSection>
      </div>
    </main>
  );
}
