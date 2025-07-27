import * as UI from "@bgord/ui";
import React from "react";
import { redirect, useFetcher } from "react-router";
import type { types } from "../../../app/services/add-entry-form";
import { API } from "../../api";
import * as Components from "../../components";
import { ReadModel } from "../../read-model";
import type { Route } from "./+types/add-entry";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader() {
  return ReadModel.AddEntryForm;
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = UI.Cookies.extractFrom(request);

  await API("/entry/log", {
    method: "POST",
    body: JSON.stringify(await request.json()),
    headers: { cookie },
  });

  return redirect("/");
}

export default function AddEntry({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const t = UI.useTranslations();

  const [step, setStep] = React.useState<Components.AddEntryNavigationStep>("situation");

  const situationDescription = UI.useField<types.SituationDescriptionType>({ name: "situation-description" });
  const situationLocation = UI.useField<types.SituationLocationType>({ name: "situation-location" });
  const situationKind = UI.useField<types.SituationKindType>({ name: "situation-kind" });

  const [emotionType, setEmotionType] = React.useState<"positive" | "negative">();
  const emotionLabel = UI.useField<types.EmotionLabelType>({ name: "emotion-label" });
  const emotionIntensity = UI.useField<types.EmotionIntensityType>({
    name: "emotion-intensity",
    defaultValue: loaderData.emotionIntensity.min,
  });
  const reactionDescription = UI.useField<types.ReactionDescriptionType>({ name: "reaction-description" });
  const reactionType = UI.useField<types.ReactionTypeType>({ name: "reaction-type" });
  const reactionEffectiveness = UI.useField<types.ReactionEffectivenessType>({
    name: "reaction-effectiveness",
    defaultValue: loaderData.reactionEffectiveness.min,
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
  };

  return (
    <main data-p="6">
      <div data-disp="flex" data-dir="column" data-maxw="md" data-mx="auto" data-p="5" data-bg="neutral-900">
        <Components.AddEntryNavigationProgress step={step} />

        <fetcher.Form
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();

            fetcher.submit(payload, {
              action: "/add-entry",
              method: "post",
              encType: "application/json",
            });
          }}
          className="add-entry-form"
          data-disp="flex"
          data-dir="column"
          data-br="sm"
          style={UI.Rhythm().times(25).minHeight}
        >
          <Components.AddEntryNavigation step={step} />

          {step === "situation" && (
            <div data-disp="flex" data-dir="column" data-gap="5" data-mt="5">
              <div data-disp="flex" data-dir="column">
                <label className="c-label" {...situationDescription.label.props}>
                  {t("entry.situation.description.label")}
                </label>

                <textarea
                  autoFocus
                  className="c-textarea"
                  placeholder={t("entry.situation.description.placeholder")}
                  rows={3}
                  {...situationDescription.input.props}
                  {...UI.Form.textareaPattern(loaderData.situationDescription)}
                />
              </div>

              <div data-disp="flex" data-gap="5">
                <div data-disp="flex" data-dir="column">
                  <label className="c-label" {...situationKind.label.props}>
                    {t("entry.situation.kind.label")}
                  </label>

                  <Components.Select {...situationKind.input.props}>
                    <option value="">{t("entry.situation.kind.value.default")}</option>
                    {loaderData.situationKinds.map((kind) => (
                      <option key={kind} value={kind}>
                        {t(`entry.situation.kind.value.${kind}`)}
                      </option>
                    ))}
                  </Components.Select>
                </div>

                <div data-disp="flex" data-dir="column" {...UI.Rhythm().times(20).style.width}>
                  <label className="c-label" {...situationLocation.label.props}>
                    {t("entry.situation.location.label")}
                  </label>

                  <input
                    className="c-input"
                    placeholder={t("entry.situation.location.placeholder")}
                    {...situationLocation.input.props}
                    {...UI.Form.inputPattern(loaderData.situationLocation)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === "emotion" && (
            <div data-disp="flex" data-dir="column" data-gap="5">
              <div data-fs="sm" data-color="neutral-200" data-mt="5">
                {t("entry.emotion.label.description")}
              </div>

              <div data-disp="flex" data-cross="end" data-gap="3" {...UI.Rhythm().times(5).style.height}>
                <button
                  type="button"
                  className="c-button"
                  data-variant={emotionType === "positive" ? "secondary" : "bare"}
                  onClick={() => setEmotionType("positive")}
                  {...UI.Rhythm().times(9).style.width}
                >
                  {t("entry.emotion.label.type.positive")}
                </button>

                <button
                  type="button"
                  className="c-button"
                  data-variant={emotionType === "negative" ? "secondary" : "bare"}
                  onClick={() => setEmotionType("negative")}
                  {...UI.Rhythm().times(9).style.width}
                >
                  {t("entry.emotion.label.type.negative")}
                </button>

                {emotionType && (
                  <div data-disp="flex" data-dir="column" data-animation="grow-fade-in">
                    <label className="c-label" {...emotionLabel.label.props}>
                      {t("entry.emotion.label.label")}
                    </label>

                    <Components.Select {...emotionLabel.input.props}>
                      <option value="">{t("entry.emotion.location.default.value")}</option>
                      {loaderData.emotionLabels
                        .filter((label) => (emotionType === "positive" ? label.positive : !label.positive))
                        .map((emotion) => (
                          <option key={emotion.option} value={emotion.option}>
                            {t(`entry.emotion.label.value.${emotion.option}`)}
                          </option>
                        ))}
                    </Components.Select>
                  </div>
                )}
              </div>

              <div data-disp="flex" data-dir="column" data-mt="5">
                <label className="c-label" {...emotionIntensity.label.props}>
                  {t("entry.emotion.intensity.label")}
                </label>

                <div data-my="auto">
                  <Components.ClickableRatingPills {...emotionIntensity} />
                </div>
              </div>
            </div>
          )}

          {step === "reaction" && (
            <div data-disp="flex" data-dir="column" data-gap="5">
              <div data-disp="flex" data-dir="column" data-grow="1" data-mt="5">
                <label className="c-label" {...reactionDescription.label.props}>
                  {t("entry.reaction.description.label")}
                </label>

                <textarea
                  autoFocus
                  className="c-textarea"
                  placeholder={t("entry.reaction.description.placeholder")}
                  rows={3}
                  {...reactionDescription.input.props}
                  {...UI.Form.textareaPattern(loaderData.reactionDescription)}
                />
              </div>

              <div data-disp="flex" data-gap="5" data-mt="5">
                <div data-disp="flex" data-dir="column">
                  <label className="c-label" {...reactionType.label.props}>
                    {t("entry.reaction.type.label")}
                  </label>

                  <Components.Select {...reactionType.input.props}>
                    <option value="">{t("entry.reaction.type.default.value")}</option>
                    {loaderData.reactionTypes.map((type) => (
                      <option key={type} value={type}>
                        {t(`entry.reaction.type.value.${type}`)}
                      </option>
                    ))}
                  </Components.Select>
                </div>

                <div data-disp="flex" data-dir="column">
                  <label className="c-label" {...reactionEffectiveness.label.props}>
                    {t("entry.reaction.effectiveness.label")}
                  </label>

                  <div data-my="auto">
                    <Components.ClickableRatingPills {...reactionEffectiveness} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "situation" && (
            <button
              onClick={() => setStep("emotion")}
              type="button"
              className="c-button"
              data-variant="secondary"
              data-mt="auto"
              data-ml="auto"
              disabled={UI.Fields.anyEmpty([situationDescription, situationKind, situationLocation])}
              {...UI.Rhythm().times(10).style.minWidth}
            >
              {t("app.next")}
            </button>
          )}

          {step === "emotion" && (
            <div data-disp="flex" data-gap="5" data-ml="auto" data-mt="auto">
              <Components.BackButton onClick={() => setStep("situation")} />

              <button
                onClick={() => setStep("reaction")}
                type="button"
                className="c-button"
                data-variant="secondary"
                disabled={UI.Fields.anyEmpty([emotionLabel, emotionIntensity])}
                {...UI.Rhythm().times(10).style.minWidth}
              >
                {t("app.next")}
              </button>
            </div>
          )}

          {step === "reaction" && (
            <div data-disp="flex" data-gap="5" data-ml="auto">
              <Components.BackButton onClick={() => setStep("emotion")} />

              <button
                type="submit"
                className="c-button"
                data-variant="primary"
                disabled={UI.Fields.anyEmpty([reactionDescription, reactionType, reactionEffectiveness])}
                {...UI.Rhythm().times(10).style.minWidth}
              >
                {t("app.add")}
              </button>
            </div>
          )}
        </fetcher.Form>
      </div>
    </main>
  );
}
