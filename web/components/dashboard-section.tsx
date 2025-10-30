import { Rhythm } from "@bgord/ui";

const column = Rhythm(450).times(1).style.width;

export function DashboardSection(props: React.JSX.IntrinsicElements["section"]) {
  return <section data-stack="y" data-gap="5" data-fs="sm" {...column} {...props} />;
}
