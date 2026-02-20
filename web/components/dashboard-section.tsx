import { Rhythm } from "@bgord/ui";

const column = Rhythm(450).times(1).style.maxWidth;

export function DashboardSection(props: React.JSX.IntrinsicElements["section"]) {
  return <section data-fs="sm" data-gap="5" data-grow="1" data-stack="y" {...column} {...props} />;
}
