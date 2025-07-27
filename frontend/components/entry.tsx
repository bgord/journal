import * as UI from "@bgord/ui";
import { Xmark } from "iconoir-react";
import { useFetcher, useSubmit } from "react-router";
import type { EntryType } from "../app/routes/home";
import { Alarm } from "./alarm";
import { EntryEmotion } from "./entry-emotion";
import { EntryReaction } from "./entry-reaction";

export function Entry(props: EntryType) {
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
    // @ts-expect-error
    <li
      {...exit.attach}
      data-testid="entry"
      data-display="flex"
      data-p="5"
      data-direction="column"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
      data-bg="neutral-900"
    >
      <header
        data-display="flex"
        data-main="between"
        data-cross="center"
        {...UI.Rhythm().times(3).style.height}
      >
        <div data-fs="base" data-fw="regular" data-color="neutral-300">
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
            <Xmark width={20} height={20} />
          </button>
        </fetcher.Form>
      </header>

      <section
        data-display="flex"
        data-direction="column"
        data-gap="5"
        data-py="6"
        data-bcb="neutral-700"
        data-bwb="hairline"
      >
        <div data-display="flex" data-gap="6">
          <div data-color="neutral-500">{t("entry.situation.description.label")}</div>

          <div data-ml="auto" data-color="neutral-200">
            @{props.situationLocation}
          </div>

          <div className="c-badge" data-variant="outline">
            {t(`entry.situation.kind.value.${props.situationKind}`)}
          </div>
        </div>

        <div
          data-display="flex"
          data-main="between"
          data-cross="center"
          data-gap="12"
          data-color="neutral-200"
        >
          <div>{props.situationDescription}</div>

          <EntryEmotion {...props} />
        </div>
      </section>

      <EntryReaction {...props} />

      {props.alarms[0] && (
        <ul data-display="flex" data-direction="column" data-gap="5" data-mb="5">
          {props.alarms.map((alarm) => (
            <Alarm key={alarm.id} {...alarm} />
          ))}
        </ul>
      )}
    </li>
  );
}
