import { Xmark } from "iconoir-react";

export function ButtonClose(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      type="button"
      className="c-button"
      data-variant="with-icon"
      data-interaction="subtle-scale"
      {...props}
    >
      <Xmark data-size="md" />
    </button>
  );
}
