import * as UI from "@bgord/ui";
import React from "react";
import { redirect, useFetcher } from "react-router";
import type { types } from "../../../app/services/add-journal-entry-form";
import { AddJournalEntryForm } from "../../../app/services/add-journal-entry-form";
import { API } from "../../api";
import * as Components from "../../components";
import { Select } from "../../components/select";
import type { Route } from "./+types/add-journal-entry";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader() {
  return AddJournalEntryForm.get();
}

export async function action({ request }: Route.ActionArgs) {
  await API("/emotions/log-entry", {
    method: "POST",
    body: JSON.stringify(await request.json()),
  });

  return redirect("/");
}

export default function AddJournalEntry({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const t = UI.useTranslations();

  const [step, setStep] = React.useState<Components.AddJournalNavigationStep>("situation");

  const situationDescription = UI.useField<types.SituationDescriptionType>({ name: "situation-description" });
  const situationLocation = UI.useField<types.SituationLocationType>({ name: "situation-location" });
  const situationKind = UI.useField<types.SituationKindType>({ name: "situation-kind" });
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

  return (
    <main data-pb="36">
      <div data-display="flex" data-direction="column" data-max-width="768" data-mx="auto" data-mt="48">
        <Components.AddJournalNavigationProgress step={step} />

        <fetcher.Form
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();

            fetcher.submit(
              {
                situation: {
                  description: situationDescription.value,
                  location: situationLocation.value,
                  kind: situationKind.value,
                },
                emotion: { label: emotionLabel.value, intensity: emotionIntensity.value },
                reaction: {
                  description: reactionDescription.value,
                  type: reactionType.value,
                  effectiveness: reactionEffectiveness.value,
                },
              },
              { action: "/add-journal-entry", method: "post", encType: "application/json" },
            );
          }}
          className="add-entry-form"
          data-display="flex"
          data-direction="column"
          data-shadow="sm"
          data-py="24"
          data-px="48"
          data-gap="12"
          data-bc="gray-200"
          data-bw="1"
          data-br="4"
          style={{ background: "var(--surface-card)", ...UI.Rhythm().times(25).minHeight }}
        >
          {step === "situation" && (
            <>
              <Components.AddJournalNavigation step={step} />

              <div data-display="flex" data-direction="column" data-gap="12">
                <div data-display="flex" data-direction="column">
                  <label className="c-label" {...situationDescription.label.props}>
                    {t("entry.situation.description.label")}
                  </label>

                  <textarea
                    className="c-textarea"
                    placeholder={t("entry.situation.description.placeholder")}
                    rows={3}
                    {...situationDescription.input.props}
                    {...UI.Form.textareaPattern(loaderData.situationDescription)}
                  />
                </div>

                <div data-display="flex" data-gap="12">
                  <div data-display="flex" data-direction="column">
                    <label className="c-label" {...situationKind.label.props}>
                      {t("entry.situation.kind.label")}
                    </label>

                    <Select className="c-select" {...situationKind.input.props}>
                      <option value="">{t("entry.situation.kind.value.default")}</option>
                      {loaderData.situationKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {t(`entry.situation.kind.value.${kind}`)}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div data-display="flex" data-direction="column" {...UI.Rhythm().times(20).style.width}>
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
            </>
          )}

          {step === "emotion" && (
            <>
              <Components.AddJournalNavigation step={step} />

              <div data-display="flex" data-gap="24">
                <div data-display="flex" data-direction="column">
                  <label className="c-label" {...emotionLabel.label.props}>
                    {t("entry.emotion.label.label")}
                  </label>

                  <Select className="c-select" {...emotionLabel.input.props}>
                    <option value="">{t("entry.emotion.location.default.value")}</option>
                    {loaderData.emotionLabels.map((emotion) => (
                      <option key={emotion} value={emotion}>
                        {t(`entry.emotion.label.value.${emotion}`)}
                      </option>
                    ))}
                  </Select>
                </div>

                <div data-display="flex" data-direction="column">
                  <label className="c-label" {...emotionIntensity.label.props}>
                    {t("entry.emotion.intensity.label")}
                  </label>

                  <div data-my="auto">
                    <Components.ClickableRatingPills {...emotionIntensity} />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === "reaction" && (
            <>
              <Components.AddJournalNavigation step={step} />

              <div data-display="flex" data-direction="column" data-gap="12">
                <div data-display="flex" data-direction="column" data-grow="1">
                  <label className="c-label" {...reactionDescription.label.props}>
                    {t("entry.reaction.description.label")}
                  </label>

                  <textarea
                    className="c-textarea"
                    placeholder={t("entry.reaction.description.placeholder")}
                    rows={3}
                    {...reactionDescription.input.props}
                    {...UI.Form.textareaPattern(loaderData.reactionDescription)}
                  />
                </div>

                <div data-display="flex" data-gap="24">
                  <div data-display="flex" data-direction="column">
                    <label className="c-label" {...reactionType.label.props}>
                      {t("entry.reaction.type.label")}
                    </label>

                    <Select className="c-select" {...reactionType.input.props}>
                      <option value="">{t("entry.reaction.type.default.value")}</option>
                      {loaderData.reactionTypes.map((type) => (
                        <option key={type} value={type}>
                          {t(`entry.reaction.type.value.${type}`)}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div data-display="flex" data-direction="column">
                    <label className="c-label" {...reactionEffectiveness.label.props}>
                      {t("entry.reaction.effectiveness.label")}
                    </label>

                    <div data-my="auto">
                      <Components.ClickableRatingPills {...reactionEffectiveness} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === "situation" && (
            <button
              onClick={() => setStep("emotion")}
              type="button"
              className="c-button"
              data-variant="secondary"
              data-ml="auto"
              disabled={UI.Fields.anyEmpty([situationDescription, situationKind, situationLocation])}
              {...UI.Rhythm().times(10).style.minWidth}
            >
              {t("app.next")}
            </button>
          )}

          {step === "emotion" && (
            <div data-display="flex" data-gap="12" data-ml="auto" data-mt="auto">
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
            <div data-display="flex" data-gap="12" data-ml="auto" data-mt="auto">
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
