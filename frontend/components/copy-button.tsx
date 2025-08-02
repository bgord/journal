import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";

export function CopyButton(props: { text: string }) {
  const [state, setState] = React.useState<"initial" | "success">("initial");

  return (
    <button
      type="button"
      className="c-button"
      data-ml="auto"
      onClick={() => {
        if (state === "initial") {
          UI.copyToClipboard({ text: props.text });
          setState("success");
          setTimeout(() => setState("initial"), 1500);
        }
      }}
    >
      {state === "initial" && <Icons.Copy data-size="md" data-animation="grow-fade-in" />}
      {state === "success" && (
        <Icons.Check data-size="md" data-color="positive-400" data-animation="grow-fade-in" />
      )}
    </button>
  );
}
