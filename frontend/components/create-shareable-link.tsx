import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as RR from "react-router";
import { CancelButton } from "./cancel-button";

export function CreateShareableLink() {
  const fetcher = RR.useFetcher();

  const dialog = UI.useToggle({ name: "dialog" });

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <>
      <button
        type="button"
        className="c-button"
        data-variant="with-icon"
        data-ml="auto"
        onClick={dialog.enable}
      >
        <Icons.Plus data-size="md" />
        Create link
      </button>

      <UI.Dialog data-mt="12" {...UI.Rhythm().times(50).style.square} {...dialog}>
        <fetcher.Form
          data-disp="flex"
          data-dir="column"
          data-gap="5"
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();
            dialog.disable();
          }}
        >
          <div data-disp="flex" data-main="between" data-cross="center">
            <strong data-disp="flex" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
              <Icons.ShareIos data-size="md" data-color="neutral-300" />
              Create shareable link
            </strong>

            <button
              className="c-button"
              data-variant="with-icon"
              type="submit"
              data-interaction="subtle-scale"
              onClick={dialog.disable}
            >
              <Icons.Xmark data-size="md" />
            </button>
          </div>

          <div data-disp="flex" data-main="end" data-gap="5" data-mt="12">
            <CancelButton onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              {...UI.Rhythm().times(10).style.width}
            >
              Create
            </button>
          </div>
        </fetcher.Form>
      </UI.Dialog>
    </>
  );
}
