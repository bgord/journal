import * as UI from "@bgord/ui";
import React from "react";
import { redirect, useFetcher } from "react-router";
import type { types } from "../../../app/services/add-journal-entry-form";
import { AddJournalEntryForm } from "../../../app/services/add-journal-entry-form";
import { API } from "../../api";
import { BackButton } from "../../components/back-button";
import { ClickableRatingPills } from "../../components/clickable-rating-pills";
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

  const [step, setStep] = React.useState<"situation" | "emotion" | "reaction">("situation");

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
      <div
        data-display="flex"
        data-direction="column"
        data-max-width="768"
        data-mx="auto"
        data-mt="72"
        data-pt="24"
      >
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
          style={{ background: "var(--surface-card)", ...UI.Rhythm().times(24).minHeight }}
        >
          {step === "situation" && (
            <>
              <div>Situation</div>
              <div data-display="flex" data-direction="column" data-gap="12">
                <div data-display="flex" data-direction="column">
                  <label className="c-label" {...situationDescription.label.props}>
                    Description
                  </label>
                  <textarea
                    className="c-textarea"
                    placeholder="I failed on my butt"
                    rows={3}
                    {...situationDescription.input.props}
                    {...UI.Form.textareaPattern(loaderData.situationDescription)}
                  />
                </div>

                <div data-display="flex" data-gap="12">
                  <div data-display="flex" data-direction="column">
                    <label className="c-label" {...situationKind.label.props}>
                      Kind
                    </label>

                    <Select className="c-select" {...situationKind.input.props}>
                      <option value="">Choose an option</option>
                      {loaderData.situationKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {kind}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div data-display="flex" data-direction="column" {...UI.Rhythm().times(15).style.width}>
                    <label className="c-label" {...situationLocation.label.props}>
                      Location
                    </label>
                    <input
                      className="c-input"
                      placeholder="Kitchen"
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
              <div>Emotion</div>

              <div data-display="flex" data-gap="24">
                <div data-display="flex" data-direction="column">
                  <label className="c-label" {...emotionLabel.label.props}>
                    Label
                  </label>

                  <Select className="c-select" {...emotionLabel.input.props}>
                    <option value="">Choose an option</option>
                    {loaderData.emotionLabels.map((emotion) => (
                      <option key={emotion} value={emotion}>
                        {emotion}
                      </option>
                    ))}
                  </Select>
                </div>

                <div data-display="flex" data-direction="column">
                  <label className="c-label" {...emotionIntensity.label.props}>
                    Intensity
                  </label>
                  <div data-my="auto">
                    <ClickableRatingPills {...emotionIntensity} />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === "reaction" && (
            <>
              <div>Reaction</div>

              <div data-display="flex" data-direction="column" data-gap="12">
                <div data-display="flex" data-direction="column" data-grow="1">
                  <label className="c-label" {...reactionDescription.label.props}>
                    Description
                  </label>
                  <textarea
                    className="c-textarea"
                    placeholder="I failed on my butt"
                    rows={3}
                    {...reactionDescription.input.props}
                    {...UI.Form.textareaPattern(loaderData.reactionDescription)}
                  />
                </div>

                <div data-display="flex" data-gap="24">
                  <div data-display="flex" data-direction="column">
                    <label className="c-label" {...reactionType.label.props}>
                      Type
                    </label>

                    <Select className="c-select" {...reactionType.input.props}>
                      <option value="">Choose an option</option>
                      {loaderData.reactionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div data-display="flex" data-direction="column">
                    <label className="c-label" {...reactionEffectiveness.label.props}>
                      Effectiveness
                    </label>
                    <div data-my="auto">
                      <ClickableRatingPills {...reactionEffectiveness} />
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
              Add emotion
            </button>
          )}

          {step === "emotion" && (
            <div data-display="flex" data-gap="12" data-ml="auto" data-mt="auto">
              <BackButton onClick={() => setStep("situation")} />
              <button
                onClick={() => setStep("reaction")}
                type="button"
                className="c-button"
                data-variant="secondary"
                disabled={UI.Fields.anyEmpty([emotionLabel, emotionIntensity])}
                {...UI.Rhythm().times(10).style.minWidth}
              >
                Add reaction
              </button>
            </div>
          )}

          {step === "reaction" && (
            <div data-display="flex" data-gap="12" data-ml="auto" data-mt="auto">
              <BackButton onClick={() => setStep("emotion")} />
              <button
                type="submit"
                className="c-button"
                data-variant="primary"
                disabled={UI.Fields.anyEmpty([reactionDescription, reactionType, reactionEffectiveness])}
                {...UI.Rhythm().times(10).style.minWidth}
              >
                Add
              </button>
            </div>
          )}
        </fetcher.Form>
      </div>
    </main>
  );
}
