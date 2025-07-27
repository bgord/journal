export function DashboardCell(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-display="flex"
      data-direction="column"
      data-br="sm"
      data-bg="neutral-900"
      data-p="5"
      {...props}
    />
  );
}
