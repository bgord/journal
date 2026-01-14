import { Sparks } from "iconoir-react";

export function Advice(props: React.JSX.IntrinsicElements["div"]) {
  const { children, ...rest } = props;
  return (
    <div {...rest}>
      <Sparks data-size="sm" data-color="brand-100" data-mr="1" /> "{children}"
    </div>
  );
}
