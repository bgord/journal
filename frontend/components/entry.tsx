import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
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

  return (
    // @ts-expect-error
    <li
      {...exit.attach}
      data-testid="entry"
      data-disp="flex"
      data-px="4"
      data-dir="column"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
      data-bg="neutral-900"
    >
      <header
        data-disp="flex"
        data-main="between"
        data-cross="center"
        data-mt="2"
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
            <Icons.Xmark data-size="md" />
          </button>
        </fetcher.Form>
      </header>

      <section
        data-disp="flex"
        data-dir="column"
        data-gap="5"
        data-py="6"
        data-bcb="neutral-700"
        data-bwb="hairline"
      >
        <div data-disp="flex" data-cross="center" data-gap="4">
          <div data-fs="sm" data-color="neutral-400">
            {t("entry.situation.description.label")}
          </div>

          <div data-ml="auto" data-color="neutral-300" data-fs="sm">
            @{props.situationLocation}
          </div>

          <div className="c-badge" data-variant="outline">
            {t(`entry.situation.kind.value.${props.situationKind}`)}
          </div>
        </div>

        <div data-disp="flex" data-main="between" data-cross="center" data-gap="12" data-color="neutral-200">
          {props.situationDescription}
        </div>

        <EntryEmotion {...props} />
      </section>

      <EntryReaction {...props} />

      {props.alarms[0] && (
        <ul data-disp="flex" data-dir="column" data-gap="5" data-mb="5">
          {props.alarms.map((alarm) => (
            <Alarm key={alarm.id} {...alarm} />
          ))}
        </ul>
      )}
    </li>
  );
}
