export function DashboardCount(props: React.JSX.IntrinsicElements["div"] & { label: string }) {
  const { label, children, ...rest } = props;

  return (
    <div data-cross="center" data-stack="y" {...rest}>
      <div data-color="neutral-500" data-transform="center">
        {label}
      </div>
      <div data-fs="3xl" data-fw="bold">
        {children}
      </div>
    </div>
  );
}
