import * as UI from "@bgord/ui";
import { useLoaderData } from "react-router";
import type { types } from "../../app/services/add-entry-form";
import type { SelectEntriesFormatted } from "../../infra/schema";
import type { loader } from "../app/routes/home";
import { RatingPills } from "./rating-pills";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export function EntryReaction(props: SelectEntriesFormatted) {
  const t = UI.useTranslations();
  const loader = useLoaderData() as LoaderData;

  const edittingReactionDescription = UI.useToggle({ name: "reaction-description-description" });
  const reactionDescription = UI.useField<types.ReactionDescriptionType>({
    name: "reaction-description",
    defaultValue: props.reactionDescription as types.ReactionDescriptionType,
  });

  return (
    <section data-display="flex" data-direction="column" data-gap="12" data-py="24">
      <div data-display="flex" data-cross="center" data-gap="12" {...UI.Rhythm().times(3).style.minHeight}>
        <div data-display="flex" data-cross="center" data-gap="6" data-color="gray-500">
          {t("entry.reaction.description.label")}
        </div>

        <div className="c-badge" data-ml="auto">
          {t(`entry.reaction.type.value.${props.reactionType}`)}
        </div>

        <RatingPills rating={props.reactionEffectiveness as number} total={5} />
      </div>

      {edittingReactionDescription.off && (
        <div onClick={edittingReactionDescription.enable}>{props.reactionDescription}</div>
      )}

      {edittingReactionDescription.on && (
        <div data-display="flex" data-direction="column" data-grow="1" data-gap="12">
          <textarea
            className="c-textarea"
            placeholder={t("entry.reaction.description.placeholder")}
            rows={3}
            {...reactionDescription.input.props}
            {...UI.Form.textareaPattern(loader.form.reactionDescription)}
          />
          <div data-display="flex" data-main="end" data-gap="12">
            <button
              className="c-button"
              type="button"
              data-variant="bare"
              onClick={() => {
                reactionDescription.clear();
                edittingReactionDescription.disable();
              }}
            >
              cancel
            </button>
            <button className="c-button" data-variant="primary">
              save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
