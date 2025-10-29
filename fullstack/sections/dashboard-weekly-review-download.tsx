import { DownloadCircle } from "iconoir-react";
import type { DashboardDataType } from "../api";

export function DashboardWeeklyReviewDownload(props: DashboardDataType["weeklyReviews"][number]) {
  return (
    <a
      href={`/api/weekly-review/${props.id}/export/download`}
      download
      target="_blank"
      data-pt="2"
      data-color="brand-500"
    >
      <DownloadCircle data-size="lg" />
    </a>
  );
}
