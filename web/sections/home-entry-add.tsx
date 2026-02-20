import {
  Autocomplete,
  Dialog,
  Fields,
  Form as form,
  Rhythm,
  TimeZoneOffset,
  useDateField,
  useMutation,
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

export function HomeEntryAdd() {
  const t = useTranslations();
  const router = useRouter();
  const dialog = useToggle({ name: "dialog" });

  const timeCapsuleMode = useToggle({ name: "timeCapsuleMode" });
  const scheduledFor = useDateField(Form.schedueldFor.field);
  const scheduledForHour = useTextField(Form.scheduledForHour.field);

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
        scheduledForHour: timeCapsuleMode.on ? Number(scheduledForHour.value) : null,
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
    onSuccess: (_, context) => {
      router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true });
      context.form?.reset();
      Fields.clearAll([
        scheduledFor,
        scheduledForHour,
        situationDescription,
        situationKind,
        emotionLabel,
        emotionIntensity,
        reactionDescription,
        reactionType,
        reactionEffectiveness,
      ]);
      dialog.disable();
    },
  });

  return (
    <>
      <button
        className="c-button"
        data-variant="with-icon"
        onClick={dialog.enable}
        type="button"
        {...dialog.props.controller}
      >
        <Plus data-size="md" />
        {t("entry.new.cta_secondary")}
      </button>

      <Dialog
        data-md-mt="0"
        data-md-p="2"
        data-mt="12"
        data-width="100%"
        data-wrap="nowrap"
        locked={mutation.isLoading}
        {...Rhythm().times(50).style.maxWidth}
        {...dialog}
      >
        <div data-cross="center" data-main="between" data-stack="x">
          <strong data-color="neutral-300" data-cross="center" data-gap="2" data-stack="x">
            <Book data-color="neutral-300" data-size="md" />
            {t("entry.new.label")}
          </strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <form data-gap="3" data-mt="5" data-stack="y" data-width="100%" onSubmit={mutation.handleSubmit}>
          <textarea
            autoFocus
            className="c-textarea"
            enterKeyHint="next"
            placeholder={t("entry.situation.description.label")}
            rows={3}
            {...situationDescription.input.props}
            {...form.textarea(Form.situationDescription.pattern)}
            {...Autocomplete.off}
          />

          <Select required {...situationKind.input.props}>
            <option value="">{t("entry.situation.kind.value.default")}</option>
            {Form.situationKind.options.map((kind) => (
              <option key={kind} value={kind}>
                {t(`entry.situation.kind.value.${kind}`)}
              </option>
            ))}
          </Select>

          <Separator />

          <div data-gap="3" data-stack="x">
            <div data-stack="x">
              <button
                className="c-button"
                data-bg={emotionType === "positive" ? "positive-900" : undefined}
                data-color="positive-400"
                data-px="3"
                data-variant={emotionType === "positive" ? undefined : "bare"}
                onClick={() => setEmotionType("positive")}
                type="button"
              >
                {t("entry.emotion.label.type.positive")}
              </button>

              <button
                className="c-button"
                data-bg={emotionType === "negative" ? "danger-900" : undefined}
                data-color="danger-400"
                data-px="3"
                data-variant={emotionType === "negative" ? undefined : "bare"}
                onClick={() => setEmotionType("negative")}
                type="button"
              >
                {t("entry.emotion.label.type.negative")}
              </button>
            </div>

            <div data-gap="3" data-grow="1" data-main="between" data-stack="x">
              {emotionType && (
                <Select data-animation="grow-fade-in" required {...emotionLabel.input.props}>
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

              <RatingPillsClickable {...emotionIntensity} />
            </div>
          </div>

          <Separator />

          <textarea
            className="c-textarea"
            enterKeyHint="next"
            placeholder={t("entry.reaction.description.label")}
            rows={3}
            {...reactionDescription.input.props}
            {...form.textarea(Form.reactionDescription.pattern)}
            {...Autocomplete.off}
          />

          <div data-cross="center" data-main="between" data-stack="x">
            <Select required {...reactionType.input.props}>
              <option value="">{t("entry.reaction.type.default.value")}</option>
              {Form.reactionType.options.map((type) => (
                <option key={type} value={type}>
                  {t(`entry.reaction.type.value.${type}`)}
                </option>
              ))}
            </Select>

            <RatingPillsClickable {...reactionEffectiveness} />
          </div>

          <div data-gap="3" data-stack="x">
            {timeCapsuleMode.off && (
              <button className="c-button" onClick={timeCapsuleMode.enable} type="button">
                <TimerOff data-color="neutral-300" data-size="md" />
              </button>
            )}

            {timeCapsuleMode.on && (
              <>
                <button
                  className="c-button"
                  onClick={timeCapsuleMode.disable}
                  type="button"
                  {...timeCapsuleMode.props.controller}
                >
                  <Timer data-color="neutral-300" data-size="md" />
                </button>

                <input
                  className="c-input"
                  enterKeyHint="next"
                  min={form.date.min.tomorrow()}
                  required
                  type="date"
                  {...timeCapsuleMode.props.target}
                  {...scheduledFor.input.props}
                />

                <Select required {...scheduledForHour.input.props}>
                  {Form.scheduledForHour.options.map((hour) => (
                    <option key={hour.label} value={hour.value}>
                      {hour.label}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </div>

          <div data-gap="5" data-main="end" data-stack="x">
            {mutation.isError && (
              <output data-color="danger-400" data-mr="auto">
                {t("entry.new.error")}
              </output>
            )}

            <ButtonCancel disabled={mutation.isLoading} onClick={dialog.disable} />

            <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
              {t("entry.new.cta_primary")}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
