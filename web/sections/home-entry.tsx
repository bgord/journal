import { Rhythm, useExitAction, useTranslations, WeakETag } from "@bgord/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { Timer, Xmark } from "iconoir-react";
import { Form } from "../../app/services/home-entry-list-form";
import type { EntrySnapshotFormatted } from "../api";
import * as UI from "../components";
import { homeRoute } from "../router";
import { useMutation } from "../sections/use-mutation";
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
      data-stack="y"
      data-py="3"
      data-px="4"
      data-bg="neutral-900"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
    >
      <header data-stack="x" data-gap="3" data-cross="center" {...Rhythm().times(3).style.height}>
        {props.origin === "time_capsule" && <Timer data-size="sm" data-color="neutral-300" />}
        <UI.EntryStartedAt startedAt={props.startedAt} data-mr="auto" />
        <Link
          to="/entry/$entryId/history"
          params={{ entryId: props.id }}
          search={Form.default}
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
            disabled={mutation.isLoading}
            data-interaction="subtle-scale"
            onClick={exit.trigger}
          >
            <Xmark data-size="md" />
          </button>
        </form>
      </header>

      <section data-stack="y" data-gap="5" data-py="2" data-pb="5" data-bcb="neutral-700" data-bwb="hairline">
        <div data-stack="x" data-cross="center" data-gap="4">
          <UI.DescriptionLabel>{t("entry.situation.description.label")}</UI.DescriptionLabel>
          <UI.EntrySituationKind situationKind={props.situationKind} />
        </div>
        <UI.EntrySituationDescription situationDescription={props.situationDescription} />
        <EntryEmotion {...props} />
      </section>
      <HomeEntryReaction {...props} />
      {props.alarms[0] && <EntryAlarms {...props} />}
    </li>
  );
}
