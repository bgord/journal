import * as UI from "@bgord/ui";
import { Xmark } from "iconoir-react";
import React from "react";
import { useFetcher, useSubmit } from "react-router";
import type { SelectEmotionJournalEntries } from "../../infra/schema";
import { RatingPills } from "./rating-pills";

type UseExitActionOptionsType = { actionFn: () => void; animation: string };

function useExitAction(options: UseExitActionOptionsType) {
  const [exiting, setExiting] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const trigger = (event?: React.MouseEvent) => {
    event?.preventDefault();
    if (!exiting) setExiting(true);
  };

  const handleEnd = (event: React.AnimationEvent) => {
    if (event.animationName !== options.animation) return;
    options.actionFn();
    setVisible(false);
  };

  const attach = exiting ? { "data-exit": options.animation, onAnimationEnd: handleEnd } : undefined;

  return { visible, attach, trigger };
}

export function Entry(props: Omit<SelectEmotionJournalEntries, "startedAt"> & { startedAt: string }) {
  const hover = UI.useHover();
  const fetcher = useFetcher();
  const submit = useSubmit();

  const isDeleting = fetcher.state !== "idle";

  const del = () => submit({ id: props.id }, { method: "delete", action: "." });
  const exit = useExitAction({
    actionFn: del,
    animation: "shrink-fade-out",
  });

  if (!exit.visible) return null;

  return (
    <li
      {...hover.attach}
      {...exit.attach}
      data-testid="entry"
      style={{ background: "var(--surface-card)" }}
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
              disabled={isDeleting}
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
          <div data-color="gray-500">What happened?</div>

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
            What was your reaction?
          </div>

          <div className="c-badge">{props.reactionType}</div>
          <RatingPills rating={props.reactionEffectiveness as number} total={5} />
        </div>

        <div>{props.reactionDescription}</div>
      </section>
    </li>
  );
}
