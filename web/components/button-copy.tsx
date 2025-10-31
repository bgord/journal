import { Clipboard } from "@bgord/ui";
import { Check, Copy } from "iconoir-react";
import { useState } from "react";

enum ButtonCopyState {
  initial = "initial",
  success = "succes",
}

const DELAY_MS = 1500;

export function ButtonCopy(props: { text: string }) {
  const [state, setState] = useState<ButtonCopyState>(ButtonCopyState.initial);

  return (
    <button
      type="button"
      className="c-button"
      data-variant="with-icon"
      onClick={async () => {
        if (state === ButtonCopyState.success) return;

        await Clipboard.copy({ text: props.text });
        setState(ButtonCopyState.success);
        setTimeout(() => setState(ButtonCopyState.initial), DELAY_MS);
      }}
    >
      {state === ButtonCopyState.initial && <Copy data-size="md" data-animation="grow-fade-in" />}
      {state === ButtonCopyState.success && (
        <Check data-size="md" data-color="positive-400" data-animation="grow-fade-in" />
      )}
    </button>
  );
}
