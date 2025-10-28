import * as UI from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import { ButtonCancel } from "../components/button-cancel";
import { DescriptionLabel } from "../components/description-label";
import { EntryReactionDescription } from "../components/entry-reaction-description";
import { RatingPillsClickable } from "../components/rating-pills-clickable";
import { Select } from "../components/select";
import type { EntryType } from "../entry.api";
import { homeRoute } from "../router";
import { RequestState } from "../ui";

export function HomeEntryReaction(props: EntryType) {
  const t = UI.useTranslations();
  const router = useRouter();
  const metaEnterSubmit = UI.useMetaEnterSubmit();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  const reactionDescriptionEdit = UI.useToggle({ name: "reaction-description" });
  const reactionDescription = UI.useTextField<types.ReactionDescriptionType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionDescription as types.ReactionDescriptionType,
  });

  const reactionType = UI.useTextField<types.ReactionTypeType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionType as types.ReactionTypeType,
  });
  const reactionTypeEdit = UI.useToggle({ name: "reaction-type" });

  const reactionEffectiveness = UI.useNumberField<types.ReactionEffectivenessType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionEffectiveness as types.ReactionEffectivenessType,
  });

  async function evaluateReaction() {
    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/entry/${props.id}/evaluate-reaction`, {
      method: "POST",
      credentials: "include",
      headers: UI.WeakETag.fromRevision(props.revision),
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

  React.useEffect(() => {
    if (reactionEffectiveness.changed || reactionType.changed) evaluateReaction();
  }, [reactionEffectiveness.value, reactionEffectiveness.changed, reactionType.value, reactionType.changed]);

  return (
    <section data-stack="y" data-gap="3">
      <div data-stack="x" data-cross="center" data-gap="5" {...UI.Rhythm().times(3).style.minHeight}>
        <DescriptionLabel data-mr="auto">{t("entry.reaction.description.label")}</DescriptionLabel>

        {reactionTypeEdit.off && (
          <div
            className="c-badge"
            data-variant="primary"
            data-cursor="pointer"
            onClick={reactionTypeEdit.enable}
          >
            {t(`entry.reaction.type.value.${reactionType.value}`)}
          </div>
        )}

        {reactionTypeEdit.on && (
          <div data-stack="x" data-gap="2" data-mr="2">
            <Select
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
            </Select>

            <ButtonCancel
              type="submit"
              disabled={state === RequestState.loading}
              onClick={UI.exec([reactionType.clear, reactionTypeEdit.disable])}
            />
          </div>
        )}

        <RatingPillsClickable {...reactionEffectiveness} />
      </div>

      {reactionDescriptionEdit.off && (
        <EntryReactionDescription
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
            {...UI.Form.textarea(Form.reactionDescription.pattern)}
            {...metaEnterSubmit}
          />

          <div data-stack="x" data-main="end" data-gap="5">
            <ButtonCancel
              disabled={state === RequestState.loading}
              onClick={UI.exec([reactionDescription.clear, reactionDescriptionEdit.disable])}
            />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={reactionDescription.unchanged || state === RequestState.loading}
              {...UI.Rhythm().times(8).style.minWidth}
            >
              {t("app.save")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
