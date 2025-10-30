import { Rhythm } from "@bgord/ui";
import { dashboardRoute } from "../router";

export function DashboardHeatmap() {
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <ul data-stack="x" data-p="5" data-gap="1">
      {dashboard?.heatmap.map((point, index) => (
        <li
          key={`heatmap-${point}-${index}`}
          data-br="xs"
          data-interaction="subtle-scale"
          data-animation="grow-fade-in"
          data-bg={point.t ? `positive-${point.c}` : `danger-${point.c}`}
          {...Rhythm(10).times(1).style.square}
        />
      ))}
    </ul>
  );
}
