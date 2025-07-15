import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import { useFetcher, useSubmit } from "react-router";
import type { SelectEntriesFull } from "../../infra/schema";
import { Alarm } from "./alarm";
import { EntryEmotion } from "./entry-emotion";
import { EntryReaction } from "./entry-reaction";

export function Entry(props: SelectEntriesFull) {
  const t = UI.useTranslations();
  const fetcher = useFetcher();
  const submit = useSubmit();

  const deleteEntry = () =>
    submit(
      { id: props.id, revision: props.revision, intent: "entry_delete" },
      { method: "delete", action: "." },
    );
  const exit = UI.useExitAction({ actionFn: deleteEntry, animation: "shrink-fade-out" });

  if (!exit.visible) return null;

  // TODO tidy-up gaps
  return (
    <li
      {...exit.attach}
      {...UI.Colorful("surface-card").style.background}
      data-testid="entry"
      data-display="flex"
      data-pt="24"
      data-px="48"
      data-direction="column"
      data-fs="14"
      data-bc="gray-200"
      data-bw="1"
      data-br="4"
      data-shadow="sm"
    >
      <header
        data-display="flex"
        data-main="between"
        data-cross="center"
        {...UI.Rhythm().times(3).style.height}
      >
        <div data-fs="16" data-fw="700" data-color="gray-700">
          {props.startedAt}
        </div>

        <fetcher.Form method="delete">
          <button
            className="c-button"
            data-variant="with-icon"
            type="submit"
            title={t("entry.delete.title")}
            disabled={fetcher.state !== "idle"}
            data-interaction="subtle-scale"
            onClick={exit.trigger}
          >
            <Icons.Xmark width={20} height={20} />
          </button>
        </fetcher.Form>
      </header>

      <section
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-py="24"
        data-bcb="gray-200"
        data-bwb="1"
      >
        <div data-display="flex" data-gap="6">
          <div data-color="gray-500">{t("entry.situation.description.label")}</div>

          <div data-ml="auto" data-color="gray-700">
            @{props.situationLocation}
          </div>

          <div className="c-badge">{t(`entry.situation.kind.value.${props.situationKind}`)}</div>
        </div>

        <div data-display="flex" data-main="between" data-cross="center" data-gap="12">
          <div>{props.situationDescription}</div>

          <EntryEmotion {...props} />
        </div>
      </section>

      <EntryReaction {...props} />

      {props.alarms[0] && (
        <ul data-display="flex" data-direction="column" data-gap="24" data-mb="24">
          {props.alarms.map((alarm) => (
            <Alarm key={alarm.id} {...alarm} />
          ))}
        </ul>
      )}
    </li>
  );
}
