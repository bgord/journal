import {
  Autocomplete,
  exec,
  Form as form,
  Rhythm,
  useMetaEnterSubmit,
  useMutation,
  useNumberField,
  useTextField,
  useToggle,
  useTranslations,
  WeakETag,
} from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import type { EntrySnapshotFormatted } from "../api";
import {
  ButtonCancel,
  DescriptionLabel,
  EntryReactionDescription,
  EntryReactionType,
  RatingPillsClickable,
  Select,
} from "../components";
import { homeRoute } from "../router";

export function HomeEntryReaction(props: EntrySnapshotFormatted) {
  const t = useTranslations();
  const router = useRouter();
  const metaEnterSubmit = useMetaEnterSubmit();

  const reactionDescriptionEdit = useToggle({ name: "reaction-description" });
  const reactionDescription = useTextField<types.ReactionDescriptionType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionDescription as types.ReactionDescriptionType,
  });

  const reactionType = useTextField<types.ReactionTypeType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionType as types.ReactionTypeType,
  });
  const reactionTypeEdit = useToggle({ name: "reaction-type" });

  const reactionEffectiveness = useNumberField<types.ReactionEffectivenessType>({
    ...Form.reactionDescription.field,
    defaultValue: props.reactionEffectiveness as types.ReactionEffectivenessType,
  });

  const mutation = useMutation({
    perform: () =>
      fetch(`/api/entry/${props.id}/evaluate-reaction`, {
        method: "POST",
        credentials: "include",
        headers: WeakETag.fromRevision(props.revision),
        body: JSON.stringify({
          description: reactionDescription.value,
          type: reactionType.value,
          effectiveness: reactionEffectiveness.value,
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true }),
  });

  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  useEffect(() => {
    if (reactionEffectiveness.changed || reactionType.changed) mutation.mutate();
  }, [reactionEffectiveness.changed, reactionType.changed]);

  return (
    <section data-stack="y" data-gap="2">
      <div data-stack="x" data-cross="center" data-gap="4" {...Rhythm().times(3).style.minHeight}>
        <DescriptionLabel data-mr="auto">{t("entry.reaction.description.label")}</DescriptionLabel>

        {reactionTypeEdit.off && (
          <EntryReactionType
            reactionType={reactionType.value as EntrySnapshotFormatted["reactionType"]}
            onClick={reactionTypeEdit.enable}
            data-cursor="pointer"
            data-focus-ring="neutral"
            {...reactionTypeEdit.props.controller}
          />
        )}

        {reactionTypeEdit.on && (
          <div data-stack="x" data-gap="2" {...reactionTypeEdit.props.target}>
            <ButtonCancel
              type="submit"
              disabled={mutation.isLoading}
              onClick={exec([reactionType.clear, reactionTypeEdit.disable])}
            />

            <Select
              {...reactionType.input.props}
              disabled={mutation.isLoading}
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
          </div>
        )}

        <RatingPillsClickable {...reactionEffectiveness} />
      </div>

      {reactionDescriptionEdit.off && (
        <EntryReactionDescription
          reactionDescription={reactionDescription.value ?? null}
          onClick={reactionDescriptionEdit.enable}
          {...reactionDescriptionEdit.props.controller}
        />
      )}

      {reactionDescriptionEdit.on && (
        <form
          method="post"
          data-stack="y"
          data-gap="5"
          onSubmit={async (event) => {
            event.preventDefault();
            await mutation.mutate();
            reactionDescriptionEdit.disable();
          }}
          {...reactionDescriptionEdit.props.target}
        >
          <textarea
            autoFocus
            className="c-textarea"
            placeholder={t("entry.reaction.description.placeholder")}
            rows={3}
            disabled={mutation.isLoading}
            {...reactionDescription.input.props}
            {...form.textarea(Form.reactionDescription.pattern)}
            {...metaEnterSubmit}
            {...Autocomplete.off}
          />

          <div data-stack="x" data-main="end" data-gap="5">
            <ButtonCancel
              disabled={mutation.isLoading}
              onClick={exec([reactionDescription.clear, reactionDescriptionEdit.disable])}
            />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={reactionDescription.unchanged || mutation.isLoading}
            >
              {t("app.save")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
