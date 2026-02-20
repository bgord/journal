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
    <main data-gap="5" data-md-m="2" data-md-pb="16" data-stack="y">
      <DashboardHeatmap />

      <div data-gap="5" data-main="around" data-md-mx="0" data-mx="3" data-stack="x">
        <DashboardSection>
          <DashboardColumnHeader>
            <Alarm data-color="brand-300" data-size="md" /> {t("dashboard.alarm.header")}
          </DashboardColumnHeader>
          <DashboardAlarmsInactivity />
          <DashboardAlarmsEntry />
        </DashboardSection>

        <DashboardSection>
          <DashboardColumnHeader>
            <Notes data-color="brand-300" data-size="md" /> {t("dashboard.entries.header")}
          </DashboardColumnHeader>
          <DashboardEntryCounts />
          <DashboardEmotionsTopList />
          <DashboardReactionsTop />
        </DashboardSection>

        <DashboardSection>
          <DashboardColumnHeader>
            <Calendar data-color="brand-300" data-size="md" /> {t("dashboard.weekly_reviews.header")}
          </DashboardColumnHeader>
          <DashboardWeeklyReviewList />
        </DashboardSection>
      </div>
    </main>
  );
}
