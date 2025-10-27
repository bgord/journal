import { Rhythm, useExitAction, useTranslations, WeakETag } from "@bgord/ui";
import { Link, useRouter } from "@tanstack/react-router";
import * as Icons from "iconoir-react";
import React from "react";
import { EntrySituationDescription } from "../components/entry-situation-description";
import { EntrySituationKind } from "../components/entry-situation-kind";
import { EntryStartedAt } from "../components/entry-started-at";
import type { EntryType } from "../entry.api";
import { homeRoute } from "../router";
import { RequestState } from "../ui";
import { EntryAlarms } from "./entry-alarms";
import { EntryEmotion } from "./home-entry-emotion";
import { HomeEntryReaction } from "./home-entry-reaction";

export function HomeEntry(props: EntryType) {
  const t = useTranslations();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);
  const router = useRouter();

  async function homeEntryDelete() {
    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/entry/${props.id}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: WeakETag.fromRevision(props.revision),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true });
  }

  const exit = useExitAction({ action: homeEntryDelete, animation: "shrink-fade-out" });

  if (!exit.visible) return null;

  return (
    <li
      {...exit.attach}
      data-stack="y"
      data-px="4"
      data-bg="neutral-900"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
    >
      <header data-stack="x" data-gap="3" data-cross="center" data-mt="2" {...Rhythm().times(3).style.height}>
        {props.origin === "time_capsule" && <Icons.Timer data-size="sm" data-color="neutral-300" />}

        <EntryStartedAt startedAt={props.startedAt} data-mr="auto" />

        <Link
          to="/entry/$entryId/history"
          params={{ entryId: props.id }}
          className="c-button"
          data-disp="flex"
          data-cross="center"
          data-variant="bare"
          data-interaction="subtle-scale"
          title={t("entry.history")}
        >
          {t("app.history")}
        </Link>

        <form method="delete">
          <button
            className="c-button"
            data-variant="with-icon"
            type="submit"
            title={t("entry.delete.title")}
            disabled={state === RequestState.loading}
            data-interaction="subtle-scale"
            onClick={exit.trigger}
          >
            <Icons.Xmark data-size="md" />
          </button>
        </form>
      </header>

      <section data-stack="y" data-gap="5" data-py="5" data-bcb="neutral-700" data-bwb="hairline">
        <div data-stack="x" data-cross="center" data-gap="4">
          <div data-fs="sm" data-color="neutral-400">
            {t("entry.situation.description.label")}
          </div>

          <EntrySituationKind situationKind={props.situationKind} />
        </div>

        <EntrySituationDescription situationDescription={props.situationDescription} />

        <EntryEmotion {...props} />
      </section>

      <HomeEntryReaction {...props} />

      {props.alarms[0] && <EntryAlarms {...props} />}
    </li>
  );
}
