import { Rhythm } from "@bgord/ui";
import { dashboardRoute } from "../router";

export function DashboardHeatmap() {
  const { heatmap } = dashboardRoute.useLoaderData();

  return (
    <ul data-stack="x" data-p="5" data-gap="1">
      {heatmap.map((point, index) => (
        <li
          key={`heatmap-${point}-${index}`}
          data-bg={point.t ? `positive-${point.c}` : `danger-${point.c}`}
          data-br="xs"
          style={Rhythm(10).times(1).square}
          data-interaction="subtle-scale"
          data-animation="grow-fade-in"
        />
      ))}
    </ul>
  );
}
