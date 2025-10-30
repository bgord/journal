import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";
import * as UI from "../components";
import { homeRoute } from "../router";
import { RequestState } from "../ui";

export function HomeEntryReaction(props: EntrySnapshotWithAlarmsFormatted) {
  const t = bg.useTranslations();
  const router = useRouter();
  const metaEnterSubmit = bg.useMetaEnterSubmit();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  const reactionDescriptionEdit = bg.useToggle({ name: "reaction-description" });
  const reactionDescription = bg.useTextField<types.ReactionDescriptionType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionDescription as types.ReactionDescriptionType,
  });

  const reactionType = bg.useTextField<types.ReactionTypeType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionType as types.ReactionTypeType,
  });
  const reactionTypeEdit = bg.useToggle({ name: "reaction-type" });

  const reactionEffectiveness = bg.useNumberField<types.ReactionEffectivenessType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionEffectiveness as types.ReactionEffectivenessType,
  });

  async function evaluateReaction() {
    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/entry/${props.id}/evaluate-reaction`, {
      method: "POST",
      credentials: "include",
      headers: bg.WeakETag.fromRevision(props.revision),
      body: JSON.stringify({
        description: reactionDescription.value,
        type: reactionType.value,
        effectiveness: reactionEffectiveness.value,
      }),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true });
  }

  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  React.useEffect(() => {
    if (reactionEffectiveness.changed || reactionType.changed) evaluateReaction();
  }, [reactionEffectiveness.changed, reactionType.changed]);

  return (
    <section data-stack="y" data-gap="3">
      <div data-stack="x" data-cross="center" data-gap="5" {...bg.Rhythm().times(3).style.minHeight}>
        <UI.DescriptionLabel data-mr="auto">{t("entry.reaction.description.label")}</UI.DescriptionLabel>

        {reactionTypeEdit.off && (
          <UI.EntryReactionType
            reactionType={reactionType.value as EntrySnapshotWithAlarmsFormatted["reactionType"]}
            data-cursor="pointer"
            onClick={reactionTypeEdit.enable}
          />
        )}

        {reactionTypeEdit.on && (
          <div data-stack="x" data-gap="2" data-mr="2">
            <UI.Select
              {...reactionType.input.props}
              disabled={state === RequestState.loading}
              onChange={(event) => {
                reactionType.input.props.onChange(event);
                reactionTypeEdit.disable();
              }}
            >
              {Form.reactionType.options.map((type) => (
                <option key={type} value={type}>
                  {t(`entry.reaction.type.value.${type}`)}
                </option>
              ))}
            </UI.Select>

            <UI.ButtonCancel
              type="submit"
              disabled={state === RequestState.loading}
              onClick={bg.exec([reactionType.clear, reactionTypeEdit.disable])}
            />
          </div>
        )}

        <UI.RatingPillsClickable {...reactionEffectiveness} />
      </div>

      {reactionDescriptionEdit.off && (
        <UI.EntryReactionDescription
          reactionDescription={reactionDescription.value ?? null}
          onClick={reactionDescriptionEdit.enable}
        />
      )}

      {reactionDescriptionEdit.on && (
        <form
          method="post"
          data-stack="y"
          data-gap="5"
          onSubmit={async (event) => {
            event.preventDefault();
            await evaluateReaction();
            reactionDescriptionEdit.disable();
          }}
        >
          <textarea
            autoFocus
            className="c-textarea"
            placeholder={t("entry.reaction.description.placeholder")}
            rows={3}
            disabled={state === RequestState.loading}
            {...reactionDescription.input.props}
            {...bg.Form.textarea(Form.reactionDescription.pattern)}
            {...metaEnterSubmit}
          />

          <div data-stack="x" data-main="end" data-gap="5">
            <UI.ButtonCancel
              disabled={state === RequestState.loading}
              onClick={bg.exec([reactionDescription.clear, reactionDescriptionEdit.disable])}
            />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={reactionDescription.unchanged || state === RequestState.loading}
              {...bg.Rhythm().times(8).style.minWidth}
            >
              {t("app.save")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
