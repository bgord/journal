import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import type { types } from "../../app/services/add-entry-form";
import type { loader } from "../app/routes/home";
import { CancelButton } from "./cancel-button";
import { ClickableRatingPills } from "./clickable-rating-pills";
import { Select } from "./select";
import { Separator } from "./separator";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export function AddEntry() {
  const t = UI.useTranslations();
  const fetcher = RR.useFetcher();
  const loader = RR.useLoaderData<LoaderData>();

  const dialog = UI.useToggle({ name: "dialog" });

  const situationDescription = UI.useField<types.SituationDescriptionType>({ name: "situation-description" });
  const situationLocation = UI.useField<types.SituationLocationType>({ name: "situation-location" });
  const situationKind = UI.useField<types.SituationKindType>({ name: "situation-kind" });

  const [emotionType, setEmotionType] = React.useState<"positive" | "negative">("positive");
  const emotionLabel = UI.useField<types.EmotionLabelType>({ name: "emotion-label" });
  const emotionIntensity = UI.useField<types.EmotionIntensityType>({
    name: "emotion-intensity",
    defaultValue: loader.form.emotionIntensity.min,
  });

  const reactionDescription = UI.useField<types.ReactionDescriptionType>({ name: "reaction-description" });
  const reactionType = UI.useField<types.ReactionTypeType>({ name: "reaction-type" });
  const reactionEffectiveness = UI.useField<types.ReactionEffectivenessType>({
    name: "reaction-effectiveness",
    defaultValue: loader.form.reactionEffectiveness.min,
  });

  const payload = {
    situationDescription: situationDescription.value,
    situationLocation: situationLocation.value,
    situationKind: situationKind.value,
    emotionLabel: emotionLabel.value,
    emotionIntensity: emotionIntensity.value,
    reactionDescription: reactionDescription.value,
    reactionType: reactionType.value,
    reactionEffectiveness: reactionEffectiveness.value,
    intent: "entry_add",
  };

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <>
      <button type="button" className="c-button" data-variant="with-icon" data-mb="5" onClick={dialog.enable}>
        <Icons.Plus data-size="md" />
        New entry
      </button>

      <UI.Dialog data-mt="12" {...UI.Rhythm().times(50).style.square} {...dialog}>
        <fetcher.Form
          data-disp="flex"
          data-dir="column"
          data-gap="5"
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();
            fetcher.submit(payload, { action: "/home", method: "post" });
            dialog.disable();
          }}
        >
          <div data-disp="flex" data-main="between" data-cross="center">
            <strong data-disp="flex" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
              <Icons.Book data-size="md" data-color="neutral-300" />
              Add new entry
            </strong>

            <button
              className="c-button"
              data-variant="with-icon"
              type="submit"
              data-interaction="subtle-scale"
              onClick={dialog.disable}
            >
              <Icons.Xmark data-size="md" />
            </button>
          </div>

          <textarea
            className="c-textarea"
            placeholder={t("entry.situation.description.label")}
            rows={3}
            autoFocus
            {...situationDescription.input.props}
            {...UI.Form.textareaPattern(loader.form.situationDescription)}
          />

          <div data-disp="flex" data-gap="8" data-cross="end">
            <Select {...situationKind.input.props}>
              <option value="">{t("entry.situation.kind.value.default")}</option>
              {loader.form.situationKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {t(`entry.situation.kind.value.${kind}`)}
                </option>
              ))}
            </Select>

            <div data-disp="flex" data-cross="center" data-gap="2">
              <Icons.MapPin data-size="md" data-color="neutral-400" />

              <input
                className="c-input"
                placeholder={t("entry.situation.location.placeholder")}
                {...situationLocation.input.props}
                {...UI.Form.inputPattern(loader.form.situationLocation)}
              />
            </div>
          </div>

          <Separator />

          <div data-disp="flex" data-main="between">
            <div data-disp="flex" data-cross="end">
              <button
                type="button"
                className="c-button"
                data-color="positive-400"
                data-variant={emotionType === "positive" ? undefined : "bare"}
                onClick={() => setEmotionType("positive")}
                {...UI.Rhythm().times(9).style.width}
              >
                {t("entry.emotion.label.type.positive")}
              </button>

              <button
                type="button"
                className="c-button"
                data-color="danger-400"
                data-variant={emotionType === "negative" ? undefined : "bare"}
                onClick={() => setEmotionType("negative")}
                {...UI.Rhythm().times(9).style.width}
              >
                {t("entry.emotion.label.type.negative")}
              </button>

              {emotionType && (
                <Select data-ml="3" data-animation="grow-fade-in" {...emotionLabel.input.props}>
                  <option value="">{t("entry.emotion.label.default.value")}</option>
                  {loader.form.emotionLabels
                    .filter((label) => (emotionType === "positive" ? label.positive : !label.positive))
                    .map((emotion) => (
                      <option key={emotion.option} value={emotion.option}>
                        {t(`entry.emotion.label.value.${emotion.option}`)}
                      </option>
                    ))}
                </Select>
              )}
            </div>

            <ClickableRatingPills {...emotionIntensity} />
          </div>

          <Separator />

          <textarea
            className="c-textarea"
            placeholder={t("entry.reaction.description.label")}
            rows={3}
            {...reactionDescription.input.props}
            {...UI.Form.textareaPattern(loader.form.reactionDescription)}
          />

          <div data-disp="flex" data-cross="center">
            <Select {...reactionType.input.props}>
              <option value="">{t("entry.reaction.type.default.value")}</option>
              {loader.form.reactionTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`entry.reaction.type.value.${type}`)}
                </option>
              ))}
            </Select>

            <label
              data-fs="xs"
              data-color="neutral-300"
              data-ls="wide"
              data-transform="uppercase"
              data-ml="12"
              data-mr="3"
              {...reactionEffectiveness.label.props}
            >
              {t("entry.reaction.effectiveness.label")}
            </label>
            <ClickableRatingPills {...reactionEffectiveness} />
          </div>

          <div data-disp="flex" data-main="end" data-gap="5" data-mt="12">
            <CancelButton onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              {...UI.Rhythm().times(12).style.width}
            >
              Save
            </button>
          </div>
        </fetcher.Form>
      </UI.Dialog>
    </>
  );
}
