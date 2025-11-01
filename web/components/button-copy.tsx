import { Clipboard } from "@bgord/ui";
import { Check, Copy } from "iconoir-react";
import { useState } from "react";
import { RequestState } from "../sections/use-mutation";

export function ButtonCopy(props: { text: string }) {
  const [state, setState] = useState<RequestState>(RequestState.idle);

  return (
    <button
      type="button"
      className="c-button"
      data-variant="with-icon"
      onClick={async () => {
        if (state === RequestState.done) return;

        await Clipboard.copy({ text: props.text });
        setState(RequestState.done);
        setTimeout(() => setState(RequestState.idle), 1500);
      }}
    >
      {state === RequestState.idle && <Copy data-size="md" data-animation="grow-fade-in" />}
      {state === RequestState.done && (
        <Check data-size="md" data-color="positive-400" data-animation="grow-fade-in" />
      )}
    </button>
  );
}
