import { Clipboard, MutationState } from "@bgord/ui";
import { Check, Copy } from "iconoir-react";
import { useState } from "react";

export function ButtonCopy(props: { text: string }) {
  const [state, setState] = useState<MutationState>(MutationState.idle);

  return (
    <button
      type="button"
      className="c-button"
      data-variant="with-icon"
      onClick={async () => {
        if (state === MutationState.done) return;

        await Clipboard.copy({ text: props.text });
        setState(MutationState.done);
        setTimeout(() => setState(MutationState.idle), 1500);
      }}
    >
      {state === MutationState.idle && <Copy data-size="md" data-animation="grow-fade-in" />}
      {state === MutationState.done && (
        <Check data-size="md" data-color="positive-400" data-animation="grow-fade-in" />
      )}
    </button>
  );
}
