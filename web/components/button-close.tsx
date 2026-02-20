import { Xmark } from "iconoir-react";

export function ButtonClose(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      className="c-button"
      data-interaction="subtle-scale"
      data-variant="with-icon"
      type="button"
      {...props}
    >
      <Xmark data-size="md" />
    </button>
  );
}
