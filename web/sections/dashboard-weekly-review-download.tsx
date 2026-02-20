import { DownloadCircle } from "iconoir-react";
import type { DashboardDataType } from "../api";

export function DashboardWeeklyReviewDownload(props: DashboardDataType["weeklyReviews"][number]) {
  return (
    <a
      data-color="brand-500"
      data-pt="2"
      download
      href={`/api/weekly-review/${props.id}/export/download`}
      target="_blank"
    >
      <DownloadCircle data-size="lg" />
    </a>
  );
}
