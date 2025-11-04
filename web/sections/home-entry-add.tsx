import {
  Autocomplete,
  Dialog,
  Form as form,
  Rhythm,
  TimeZoneOffset,
  useDateField,
  useNumberField,
  useShortcuts,
  useTextField,
  useToggle,
  useTranslations,
} from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Book, Plus, Timer, TimerOff } from "iconoir-react";
import { useState } from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import { ButtonCancel, ButtonClose, RatingPillsClickable, Select, Separator } from "../components";
import { homeRoute } from "../router";
import { useMutation } from "../sections/use-mutation";

export function HomeEntryAdd() {
  const t = useTranslations();
  const router = useRouter();
  const dialog = useToggle({ name: "dialog" });

  const timeCapsuleMode = useToggle({ name: "timeCapsuleMode" });
  const scheduledFor = useDateField(Form.schedueldFor.field);

  const situationDescription = useTextField(Form.situationDescription.field);
  const situationKind = useTextField<types.SituationKindType>(Form.situationKind.field);

  const [emotionType, setEmotionType] = useState<"positive" | "negative">("positive");
  const emotionLabel = useTextField<types.EmotionLabelType>(Form.emotionLabel.field);
  const emotionIntensity = useNumberField(Form.emotionIntensity.field);

  const reactionDescription = useTextField(Form.reactionDescription.field);
  const reactionType = useTextField<types.ReactionTypeType>(Form.reactionType.field);
  const reactionEffectiveness = useNumberField(Form.reactionEffectiveness.field);

  useShortcuts({ "$mod+Control+KeyN": dialog.enable });

  const mutation = useMutation({
    perform: () => {
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

      const url =
        payload.intent === "entry_add" ? "/api/entry/log" : "/api/entry/time-capsule-entry/schedule";

      return fetch(url, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: TimeZoneOffset.get(),
      });
    },
    onSuccess: () => {
      router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true });
      dialog.disable();
    },
  });

  return (
    <>
      <button
        type="button"
        className="c-button"
        data-variant="with-icon"
        onClick={dialog.enable}
        {...dialog.props.controller}
      >
        <Plus data-size="md" />
        {t("entry.new.cta_secondary")}
      </button>

      <Dialog
        data-mt="12"
        // locked={state === RequestState.loading}
        {...Rhythm().times(50).style.square}
        {...dialog}
      >
        <div data-stack="x" data-main="between" data-cross="center">
          <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
            <Book data-size="md" data-color="neutral-300" />
            {t("entry.new.label")}
          </strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <form data-stack="y" data-gap="5" data-mt="5" data-width="100%" onSubmit={mutation.handleSubmit}>
          <textarea
            className="c-textarea"
            placeholder={t("entry.situation.description.label")}
            rows={3}
            autoFocus
            {...situationDescription.input.props}
            {...form.textarea(Form.situationDescription.pattern)}
            {...Autocomplete.off}
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
                {...Rhythm().times(9).style.width}
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
                {...Rhythm().times(9).style.width}
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
            {...form.textarea(Form.reactionDescription.pattern)}
            {...Autocomplete.off}
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
                  min={form.date.min.tomorrow()}
                  {...timeCapsuleMode.props.target}
                  {...scheduledFor.input.props}
                />
              </>
            )}
          </div>

          <div data-stack="x" data-main="end" data-gap="5">
            {mutation.isError && (
              <output data-mr="auto" data-color="danger-400">
                {t("entry.new.error")}
              </output>
            )}

            <ButtonCancel disabled={mutation.isLoading} onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={mutation.isLoading}
              {...Rhythm().times(10).style.width}
            >
              {t("entry.new.cta_primary")}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
