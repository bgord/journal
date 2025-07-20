import * as UI from "@bgord/ui";

export function DashboardCell(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-display="flex"
      data-direction="column"
      data-gap="12"
      data-p="24"
      data-bc="gray-200"
      data-bw="1"
      data-br="4"
      data-shadow="sm"
      {...UI.Colorful("surface-card").style.background}
      {...props}
    />
  );
}
