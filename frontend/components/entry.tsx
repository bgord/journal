import * as UI from "@bgord/ui";
import { Xmark } from "iconoir-react";
import { useFetcher, useSubmit } from "react-router";
import type { SelectEmotionJournalEntries } from "../../infra/schema";
import { RatingPills } from "./rating-pills";

export function Entry(props: Omit<SelectEmotionJournalEntries, "startedAt"> & { startedAt: string }) {
  const t = UI.useTranslations();
  const hover = UI.useHover();
  const fetcher = useFetcher();
  const submit = useSubmit();

  const deleteEntry = () => submit({ id: props.id }, { method: "delete", action: "." });
  const exit = UI.useExitAction({ actionFn: deleteEntry, animation: "shrink-fade-out" });

  if (!exit.visible) return null;

  return (
    <li
      {...hover.attach}
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

        {hover.isHovering && (
          <fetcher.Form method="delete">
            <input type="hidden" name="id" value={props.id} />
            <button
              className="c-button"
              data-variant="with-icon"
              type="submit"
              title="Delete entry"
              disabled={fetcher.state !== "idle"}
              data-interaction="subtle-scale"
              onClick={exit.trigger}
            >
              <Xmark width={20} height={20} />
            </button>
          </fetcher.Form>
        )}
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

          <div className="c-badge">{props.situationKind}</div>
        </div>

        <div data-display="flex" data-main="between" data-cross="center" data-gap="12">
          <div>{props.situationDescription}</div>

          <div data-display="flex" data-cross="center" data-gap="12">
            <div className="c-badge">{props.emotionLabel}</div>

            <RatingPills rating={props.emotionIntensity as number} total={5} />
          </div>
        </div>
      </section>

      <section data-display="flex" data-direction="column" data-gap="12" data-py="24">
        <div data-display="flex" data-cross="center" data-gap="12">
          <div data-color="gray-500" data-mr="auto">
            {t("entry.reaction.description.label")}
          </div>

          <div className="c-badge">{props.reactionType}</div>
          <RatingPills rating={props.reactionEffectiveness as number} total={5} />
        </div>

        <div>{props.reactionDescription}</div>
      </section>
    </li>
  );
}
