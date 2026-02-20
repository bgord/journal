import { Clipboard, MutationState } from "@bgord/ui";
import { Check, Copy } from "iconoir-react";
import { useState } from "react";

export function ButtonCopy(props: { text: string }) {
  const [state, setState] = useState<MutationState>(MutationState.idle);

  return (
    <button
      className="c-button"
      data-variant="with-icon"
      onClick={async () => {
        if (state === MutationState.done) return;

        await Clipboard.copy({ text: props.text });
        setState(MutationState.done);
        setTimeout(() => setState(MutationState.idle), 1500);
      }}
      type="button"
    >
      {state === MutationState.idle && <Copy data-animation="grow-fade-in" data-size="md" />}
      {state === MutationState.done && (
        <Check data-animation="grow-fade-in" data-color="positive-400" data-size="md" />
      )}
    </button>
  );
}
