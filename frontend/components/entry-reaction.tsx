import * as UI from "@bgord/ui";
import React from "react";
import * as RR from "react-router";
import type { types } from "../../app/services/add-entry-form";
import type { SelectEntriesFormatted } from "../../infra/schema";
import type { loader } from "../app/routes/home";
import { CancelButton } from "./cancel-button";
import { ClickableRatingPills } from "./clickable-rating-pills";
import { Select } from "./select";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export function EntryReaction(props: SelectEntriesFormatted) {
  const t = UI.useTranslations();
  const loader = RR.useLoaderData<LoaderData>();
  const fetcher = RR.useFetcher();
  const submit = RR.useSubmit();

  const editingReactionDescription = UI.useToggle({ name: "reaction-description" });
  const editingReactionType = UI.useToggle({ name: "reaction-type" });

  const reactionDescription = UI.useField<types.ReactionDescriptionType>({
    name: "description",
    defaultValue: props.reactionDescription as types.ReactionDescriptionType,
  });
  const reactionType = UI.useField<types.ReactionTypeType>({
    name: "type",
    defaultValue: props.reactionType as types.ReactionTypeType,
  });
  const reactionEffectiveness = UI.useField<types.ReactionEffectivenessType>({
    name: "effectiveness",
    defaultValue: props.reactionEffectiveness as types.ReactionEffectivenessType,
  });

  const evaluateReaction = () =>
    submit(
      {
        id: props.id,
        revision: props.revision,
        intent: "evaluate_reaction",
        description: reactionDescription.value,
        type: reactionType.value,
        effectiveness: reactionEffectiveness.value,
      },
      { method: "post", action: "." },
    );

  React.useEffect(() => {
    evaluateReaction();
  }, [reactionEffectiveness.value]);

  React.useEffect(() => {
    evaluateReaction();
  }, [reactionType.value]);

  return (
    <section data-display="flex" data-direction="column" data-gap="12" data-py="24">
      <div data-display="flex" data-cross="center" data-gap="12" {...UI.Rhythm().times(3).style.minHeight}>
        <div data-display="flex" data-cross="center" data-gap="6" data-color="gray-500" data-mr="auto">
          {t("entry.reaction.description.label")}
        </div>

        {editingReactionType.off && (
          <div className="c-badge" onClick={editingReactionType.enable} data-cursor="pointer">
            {t(`entry.reaction.type.value.${reactionType.value}`)}
          </div>
        )}

        {editingReactionType.on && (
          <Select
            {...reactionType.input.props}
            onChange={(event) => {
              reactionType.input.props.onChange(event);
              editingReactionType.disable();
            }}
          >
            {loader.form.reactionTypes.map((type: types.ReactionTypeType) => (
              <option key={type} value={type}>
                {t(`entry.reaction.type.value.${type}`)}
              </option>
            ))}
          </Select>
        )}

        <ClickableRatingPills {...reactionEffectiveness} />
      </div>

      {editingReactionDescription.off && (
        <div onClick={editingReactionDescription.enable}>{reactionDescription.value}</div>
      )}

      {editingReactionDescription.on && (
        <fetcher.Form
          method="post"
          data-display="flex"
          data-direction="column"
          data-gap="12"
          onSubmit={(event) => {
            event.preventDefault();
            evaluateReaction();
            editingReactionDescription.disable();
          }}
        >
          <textarea
            autoFocus
            className="c-textarea"
            placeholder={t("entry.reaction.description.placeholder")}
            rows={3}
            {...reactionDescription.input.props}
            {...UI.Form.textareaPattern(loader.form.reactionDescription)}
          />

          <div data-display="flex" data-main="end" data-gap="12">
            <CancelButton
              onClick={() => {
                reactionDescription.clear();
                editingReactionDescription.disable();
              }}
            />

            <button
              className="c-button"
              type="submit"
              data-variant="primary"
              disabled={reactionDescription.unchanged}
            >
              {t("app.save")}
            </button>
          </div>
        </fetcher.Form>
      )}
    </section>
  );
}
