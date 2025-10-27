import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Book, Plus, Timer, TimerOff, Xmark } from "iconoir-react";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import { ButtonCancel } from "../components/button-cancel";
import { RatingPillsClickable } from "../components/rating-pills-clickable";
import { Select } from "../components/select";
import { Separator } from "../components/separator";
import { homeRoute } from "../router";
import { RequestState } from "../ui";

export function HomeEntryAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);
  const dialog = bg.useToggle({ name: "dialog" });

  const timeCapsuleMode = bg.useToggle({ name: "timeCapsuleMode" });
  const scheduledFor = bg.useDateField(Form.schedueldFor.field);

  const situationDescription = bg.useTextField(Form.situationDescription.field);
  const situationKind = bg.useTextField<types.SituationKindType>(Form.situationKind.field);

  const [emotionType, setEmotionType] = React.useState<"positive" | "negative">("positive");
  const emotionLabel = bg.useTextField<types.EmotionLabelType>(Form.emotionLabel.field);
  const emotionIntensity = bg.useNumberField(Form.emotionIntensity.field);

  const reactionDescription = bg.useTextField(Form.reactionDescription.field);
  const reactionType = bg.useTextField<types.ReactionTypeType>(Form.reactionType.field);
  const reactionEffectiveness = bg.useNumberField(Form.reactionEffectiveness.field);

  bg.useShortcuts({ "$mod+Control+KeyN": dialog.enable });

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

    const url = payload.intent === "entry_add" ? "/api/entry/log" : "/api/entry/time-capsule-entry/schedule";

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
      headers: bg.TimeZoneOffset.get(),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true });
    dialog.disable();
  }

  return (
    <>
      <button type="button" className="c-button" data-variant="with-icon" onClick={dialog.enable}>
        <Plus data-size="md" />
        {t("entry.new.cta_secondary")}
      </button>

      <bg.Dialog
        data-mt="12"
        // locked={state === RequestState.loading}
        {...bg.Rhythm().times(50).style.square}
        {...dialog}
      >
        <div data-stack="x" data-main="between" data-cross="center">
          <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
            <Book data-size="md" data-color="neutral-300" />
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
            <Xmark data-size="md" />
          </button>
        </div>

        <form data-stack="y" data-gap="5" data-mt="5" onSubmit={addEntry}>
          <textarea
            className="c-textarea"
            placeholder={t("entry.situation.description.label")}
            rows={3}
            autoFocus
            {...situationDescription.input.props}
            {...bg.Form.textarea(Form.situationDescription.pattern)}
            {...bg.Autocomplete.off}
          />

          <div data-stack="x" data-gap="8" data-cross="end">
            <Select required {...situationKind.input.props}>
              <option value="">{t("entry.situation.kind.value.default")}</option>
              {Form.situationKind.options.map((kind) => (
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
                {...bg.Rhythm().times(9).style.width}
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
                {...bg.Rhythm().times(9).style.width}
              >
                {t("entry.emotion.label.type.negative")}
              </button>

              {emotionType && (
                <Select required data-ml="3" data-animation="grow-fade-in" {...emotionLabel.input.props}>
                  <option value="">{t("entry.emotion.label.default.value")}</option>
                  {(emotionType === "positive" ? Form.emotionLabel.positive : Form.emotionLabel.negative).map(
                    (emotion) => (
                      <option key={emotion} value={emotion}>
                        {t(`entry.emotion.label.value.${emotion}`)}
                      </option>
                    ),
                  )}
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
            {...bg.Form.textarea(Form.reactionDescription.pattern)}
            {...bg.Autocomplete.off}
          />

          <div data-stack="x" data-cross="center">
            <Select required {...reactionType.input.props}>
              <option value="">{t("entry.reaction.type.default.value")}</option>
              {Form.reactionType.options.map((type) => (
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
                <TimerOff data-size="md" data-color="neutral-300" />
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
                  <Timer data-size="md" data-color="neutral-300" />
                </button>
                <input
                  className="c-input"
                  required
                  type="date"
                  min={bg.Form.date.min.tomorrow()}
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
              {...bg.Rhythm().times(10).style.width}
            >
              {t("entry.new.cta_primary")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
