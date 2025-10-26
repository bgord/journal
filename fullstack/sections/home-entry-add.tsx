import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { HomeEntryAddForm } from "../../app/services/home-entry-add-form";
import { ButtonCancel } from "../components/button-cancel";
import { RatingPillsClickable } from "../components/rating-pills-clickable";
import { Select } from "../components/select";
import { Separator } from "../components/separator";
import { RequestState } from "../ui";

export function HomeEntryAdd() {
  const t = UI.useTranslations();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  const dialog = UI.useToggle({ name: "dialog" });

  const timeCapsuleMode = UI.useToggle({ name: "time-capsule-mode" });
  const scheduledFor = UI.useDateField({ name: "scheduledFor" });

  const situationDescription = UI.useTextField<types.SituationDescriptionType>({
    name: "situationDescription",
  });
  const situationKind = UI.useTextField<types.SituationKindType>({ name: "situationKind" });

  const [emotionType, setEmotionType] = React.useState<"positive" | "negative">("positive");
  const emotionLabel = UI.useTextField<types.EmotionLabelType>({ name: "emotionLabel" });
  const emotionIntensity = UI.useNumberField<types.EmotionIntensityType>({
    name: "emotionIntensity",
    defaultValue: HomeEntryAddForm.emotionIntensity.min,
  });

  const reactionDescription = UI.useTextField<types.ReactionDescriptionType>({ name: "reactionDescription" });
  const reactionType = UI.useTextField<types.ReactionTypeType>({ name: "reactionType" });
  const reactionEffectiveness = UI.useNumberField<types.ReactionEffectivenessType>({
    name: "reactionEffectiveness",
    defaultValue: HomeEntryAddForm.reactionEffectiveness.min,
  });

  UI.useShortcuts({ "$mod+Control+KeyN": dialog.enable });

  async function addEntry(event: React.FormEvent) {
    event.preventDefault();

    const payload = {
      intent: timeCapsuleMode.on ? "time_capsule_entry_add" : "entry_add",
      scheduledFor: timeCapsuleMode.on ? scheduledFor.value : null,
      situationDescription: situationDescription.value,
      situationKind: situationKind.value,
      emotionLabel: emotionLabel.value,
      emotionIntensity: emotionIntensity.value,
      reactionDescription: reactionDescription.value,
      reactionType: reactionType.value,
      reactionEffectiveness: reactionEffectiveness.value,
    };

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    if (payload.intent === "entry_add") {
      const response = await fetch("/api/entry/log", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) return setState(RequestState.error);
    }

    if (payload.intent === "time_capsule_entry_add") {
      const response = await fetch("/api/entry/time-capsule-entry/schedule", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: UI.TimeZoneOffset.get(),
      });

      if (!response.ok) return setState(RequestState.error);
    }

    setState(RequestState.done);
    dialog.disable();
  }

  return (
    <>
      <button type="button" className="c-button" data-variant="with-icon" onClick={dialog.enable}>
        <Icons.Plus data-size="md" />
        {t("entry.new.cta_secondary")}
      </button>

      <UI.Dialog data-mt="12" {...UI.Rhythm().times(50).style.square} {...dialog}>
        <div data-stack="x" data-main="between" data-cross="center">
          <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
            <Icons.Book data-size="md" data-color="neutral-300" />
            {t("entry.new.label")}
          </strong>

          <button
            className="c-button"
            data-variant="with-icon"
            type="submit"
            data-interaction="subtle-scale"
            disabled={state === RequestState.loading}
            onClick={dialog.disable}
          >
            <Icons.Xmark data-size="md" />
          </button>
        </div>

        <form data-stack="y" data-gap="5" data-mt="5" onSubmit={addEntry}>
          <textarea
            className="c-textarea"
            placeholder={t("entry.situation.description.label")}
            rows={3}
            autoFocus
            {...situationDescription.input.props}
            {...UI.Form.textarea(HomeEntryAddForm.situationDescription)}
            {...UI.Autocomplete.off}
          />

          <div data-stack="x" data-gap="8" data-cross="end">
            <Select required {...situationKind.input.props}>
              <option value="">{t("entry.situation.kind.value.default")}</option>
              {HomeEntryAddForm.situationKind.options.map((kind) => (
                <option key={kind} value={kind}>
                  {t(`entry.situation.kind.value.${kind}`)}
                </option>
              ))}
            </Select>
          </div>

          <Separator />

          <div data-stack="x" data-main="between">
            <div data-stack="x" data-cross="end">
              <button
                type="button"
                className="c-button"
                data-color="positive-400"
                data-bg={emotionType === "positive" ? "positive-900" : undefined}
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
                data-bg={emotionType === "negative" ? "danger-900" : undefined}
                data-variant={emotionType === "negative" ? undefined : "bare"}
                onClick={() => setEmotionType("negative")}
                {...UI.Rhythm().times(9).style.width}
              >
                {t("entry.emotion.label.type.negative")}
              </button>

              {emotionType && (
                <Select required data-ml="3" data-animation="grow-fade-in" {...emotionLabel.input.props}>
                  <option value="">{t("entry.emotion.label.default.value")}</option>
                  {(emotionType === "positive"
                    ? HomeEntryAddForm.emotionLabel.positive
                    : HomeEntryAddForm.emotionLabel.negative
                  ).map((emotion) => (
                    <option key={emotion} value={emotion}>
                      {t(`entry.emotion.label.value.${emotion}`)}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <RatingPillsClickable {...emotionIntensity} />
          </div>

          <Separator />

          <textarea
            className="c-textarea"
            placeholder={t("entry.reaction.description.label")}
            rows={3}
            {...reactionDescription.input.props}
            {...UI.Form.textarea(HomeEntryAddForm.reactionDescription)}
            {...UI.Autocomplete.off}
          />

          <div data-stack="x" data-cross="center">
            <Select required {...reactionType.input.props}>
              <option value="">{t("entry.reaction.type.default.value")}</option>
              {HomeEntryAddForm.reactionType.options.map((type) => (
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
            >
              {t("entry.reaction.effectiveness.label")}
            </label>
            <RatingPillsClickable {...reactionEffectiveness} />
          </div>

          <div data-stack="x" data-gap="3">
            {timeCapsuleMode.off && (
              <button type="button" className="c-button" onClick={timeCapsuleMode.enable}>
                <Icons.TimerOff data-size="md" data-color="neutral-300" />
              </button>
            )}

            {timeCapsuleMode.on && (
              <>
                <button
                  type="button"
                  className="c-button"
                  onClick={timeCapsuleMode.disable}
                  {...timeCapsuleMode.props.controller}
                >
                  <Icons.Timer data-size="md" data-color="neutral-300" />
                </button>
                <input
                  className="c-input"
                  required
                  type="date"
                  min={UI.Form.date.min.tomorrow()}
                  {...timeCapsuleMode.props.target}
                  {...scheduledFor.input.props}
                />
              </>
            )}
          </div>

          <div data-stack="x" data-main="end" data-gap="5">
            {state === RequestState.error && (
              <output data-mr="auto" data-color="danger-400">
                {t("entry.new.error")}
              </output>
            )}

            <ButtonCancel disabled={state === RequestState.loading} onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={state === RequestState.loading}
              {...UI.Rhythm().times(10).style.width}
            >
              {t("entry.new.cta_primary")}
            </button>
          </div>
        </form>
      </UI.Dialog>
    </>
  );
}
