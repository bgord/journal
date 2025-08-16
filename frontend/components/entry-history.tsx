import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as RR from "react-router";
import type { EntryType, loader } from "../app/routes/home";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export function EntryHistory(props: EntryType) {
  const t = UI.useTranslations();
  const [, setSearchParams] = RR.useSearchParams();
  const loader = RR.useLoaderData<LoaderData>();

  const builder = UI.useToggle({ name: `entry-history-${props.id}` });

  const dialog = {
    ...builder,
    enable: () => {
      builder.enable();
      setSearchParams({ historyFor: props.id });
    },
    disable: () => {
      builder.disable();
      setSearchParams({});
    },
  };

  return (
    <>
      <button type="button" className="c-button" data-variant="bare" onClick={dialog.enable}>
        {t("app.history")}
      </button>

      <UI.Dialog data-mt="12" {...UI.Rhythm().times(50).style.width} {...dialog}>
        <div data-stack="x" data-main="between" data-cross="center">
          <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
            <Icons.List data-size="md" data-color="neutral-300" />
            {t("entry.history")}
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

        <ul data-stack="y" data-gap="2" data-mt="5">
          {loader.entryHistory.map((entry) => (
            <li key={entry.id} data-stack="x" data-main="between" data-color="neutral-300">
              <div>- {t(entry.operation, entry.payload)}</div>
              <div data-fs="xs" data-color="neutral-500" style={{ fontVariantNumeric: "tabular-nums" }}>
                {entry.createdAt}
              </div>
            </li>
          ))}
        </ul>
      </UI.Dialog>
    </>
  );
}
