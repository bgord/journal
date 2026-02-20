import { Rhythm } from "@bgord/ui";
import { dashboardRoute } from "../router";

export function DashboardHeatmap() {
  const dashboard = dashboardRoute.useLoaderData();

  return (
    <ul data-gap="1" data-md-p="0" data-p="5" data-stack="x">
      {dashboard?.heatmap.map((point, index) => (
        <li
          data-animation="grow-fade-in"
          data-bg={point.t ? `positive-${point.c}` : `danger-${point.c}`}
          data-br="xs"
          data-interaction="subtle-scale"
          key={`heatmap-${point}-${index}`}
          {...Rhythm(10).times(1).style.square}
        />
      ))}
    </ul>
  );
}
