import { Sparks } from "iconoir-react";

export function Advice(props: React.JSX.IntrinsicElements["q"]) {
  const { children, ...rest } = props;
  return (
    <q {...rest}>
      <Sparks data-color="brand-100" data-mr="1" data-size="xs" /> {children}
    </q>
  );
}
