import { Rhythm, useExitAction, useMutation, useTranslations, WeakETag } from "@bgord/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { Timer, Xmark } from "iconoir-react";
import { Form } from "../../app/services/home-entry-list-form";
import type { EntrySnapshotFormatted } from "../api";
import {
  DescriptionLabel,
  EntrySituationDescription,
  EntrySituationKind,
  EntryStartedAt,
} from "../components";
import { homeRoute } from "../router";
import { EntryAlarms } from "./entry-alarms";
import { EntryEmotion } from "./home-entry-emotion";
import { HomeEntryReaction } from "./home-entry-reaction";

export function HomeEntry(props: EntrySnapshotFormatted) {
  const t = useTranslations();
  const router = useRouter();

  const mutation = useMutation({
    perform: () =>
      fetch(`/api/entry/${props.id}/delete`, {
        method: "DELETE",
        credentials: "include",
        headers: WeakETag.fromRevision(props.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true }),
  });

  const exit = useExitAction({ action: mutation.mutate, animation: "shrink-fade-out" });

  if (!exit.visible) return null;

  return (
    // @ts-expect-error
    <li
      {...exit.attach}
      data-bg="neutral-900"
      data-br="xs"
      data-gap="5"
      data-p="5"
      data-pt="3"
      data-shadow="sm"
      data-stack="y"
    >
      <header data-cross="center" data-gap="3" data-stack="x" {...Rhythm().times(3).style.height}>
        {props.origin === "time_capsule" && <Timer data-color="neutral-300" data-size="sm" />}
        <EntryStartedAt data-mr="auto" startedAt={props.startedAt} />
        <Link
          className="c-button"
          data-variant="bare"
          params={{ entryId: props.id }}
          search={Form.default}
          title={t("entry.history")}
          to="/entry/$entryId/history"
        >
          {t("app.history")}
        </Link>
        <button
          className="c-button"
          data-interaction="subtle-scale"
          data-variant="with-icon"
          disabled={mutation.isLoading}
          onClick={exit.trigger}
          title={t("entry.delete.title")}
          type="submit"
        >
          <Xmark data-size="md" />
        </button>
      </header>

      <section data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="3" data-stack="x">
          <DescriptionLabel>{t("entry.situation.description.label")}</DescriptionLabel>
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
