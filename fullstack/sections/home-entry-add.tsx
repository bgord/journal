import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { HomeEntryAddForm } from "../../app/services/home-entry-add-form";
import { ButtonCancel } from "../components/button-cancel";
import { RatingPillsClickable } from "../components/rating-pills-clickable";
import { Select } from "../components/select";
import { Separator } from "../components/separator";
import { useField } from "./use-field";

export function HomeEntryAdd() {
  const t = UI.useTranslations();

  const dialog = UI.useToggle({ name: "dialog" });
  const timeCapsuleMode = UI.useToggle({ name: "time-capsule-mode" });

  const situationDescription = useField<types.SituationDescriptionType>({ name: "situationDescription" });

  const [emotionType, setEmotionType] = React.useState<"positive" | "negative">("positive");
  const emotionIntensity = useField<types.EmotionIntensityType>({
    name: "emotionIntensity",
    defaultValue: HomeEntryAddForm.emotionIntensity.max,
  });

  UI.useShortcuts({ "$mod+Control+KeyN": dialog.enable });

  async function addEntry(event: React.FormEvent) {
    event.preventDefault();

    const payload = {
      situationDescription: situationDescription.value,
      emotionIntensity: emotionIntensity.value,
    };

    console.log(payload);

    // if (state === RequestState.loading) return;

    // setState(RequestState.loading);

    // const response = await fetch("/api/auth/delete-user", {
    //   method: "POST",
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({}),
    // });

    // if (!response.ok) return setState(RequestState.error);

    // setState(RequestState.done);
    // window.location.replace("/login");
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
            onClick={dialog.disable}
          >
            <Icons.Xmark data-size="md" />
          </button>
        </div>

        <form data-stack="y" data-gap="5" data-mt="5" onSubmit={addEntry}>
          {/* @ts-expect-error */}
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
            <Select required>
              <option value="">{t("entry.situation.kind.value.default")}</option>
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
                <Select required data-ml="3" data-animation="grow-fade-in">
                  <option value="">{t("entry.emotion.label.default.value")}</option>
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
            // {...UI.Form.textarea(loader.form.reactionDescription)}
          />
          <div data-stack="x" data-cross="center">
            <Select required>
              <option value="">{t("entry.reaction.type.default.value")}</option>
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
            {/* <RatingPillsClickable {...reactionEffectiveness} /> */}
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
                  min={new Date().toISOString().split("T")[0]}
                  {...timeCapsuleMode.props.target}
                />
              </>
            )}
          </div>
          <div data-stack="x" data-main="end" data-gap="5">
            <ButtonCancel onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
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
