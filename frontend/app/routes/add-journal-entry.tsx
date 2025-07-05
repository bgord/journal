import * as UI from "@bgord/ui";
import React from "react";
import { EmotionIntensity } from "../../../modules/emotions/value-objects/emotion-intensity";
import { EmotionLabel } from "../../../modules/emotions/value-objects/emotion-label";
import { ReactionDescription } from "../../../modules/emotions/value-objects/reaction-description";
import { ReactionEffectiveness } from "../../../modules/emotions/value-objects/reaction-effectiveness";
import { ReactionType } from "../../../modules/emotions/value-objects/reaction-type";
import { SituationDescription } from "../../../modules/emotions/value-objects/situation-description";
import { SituationKind } from "../../../modules/emotions/value-objects/situation-kind";
import { SituationLocation } from "../../../modules/emotions/value-objects/situation-location";
import { Select } from "../../components/select";
import type { Route } from "./+types/add-journal-entry";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export function loader() {
  // TODO extract to a service
  return {
    situationDescription: {
      min: SituationDescription.MinimumLength,
      max: SituationDescription.MaximumLength,
    },
    situationLocation: {
      min: SituationLocation.MinimumLength,
      max: SituationLocation.MaximumLength,
    },
    situationKinds: SituationKind.all(),
    emotionLabels: EmotionLabel.all(),
    emotionIntensity: {
      min: EmotionIntensity.Minimum,
      max: EmotionIntensity.Maximum,
    },
    reactionDescription: {
      min: ReactionDescription.MinimumLength,
      max: ReactionDescription.MaximumLength,
    },
    reactionTypes: ReactionType.all(),
    reactionEffectiveness: {
      min: ReactionEffectiveness.Minimum,
      max: ReactionEffectiveness.Maximum,
    },
  };
}

export default function AddJournalEntry({ loaderData }: Route.ComponentProps) {
  const [step, setStep] = React.useState<"situation" | "emotion" | "reaction">("situation");

  const situationDescription = UI.useField({ name: "situation-description" });
  const situationLocation = UI.useField({ name: "situation-location" });
  // const situationKind = UI.useField({ name: "situation-kind" });
  // const emotionLabel = UI.useField({ name: "emotion-label" });
  // const emotionIntensity = UI.useField({ name: "emotion-intensity" });
  const reactionDescription = UI.useField({ name: "reaction-description" });
  // const reactionType = UI.useField({ name: "reaction-type" });
  // const reactionEffectiveness = UI.useField({ name: "reaction-effectiveness" });

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
        <form
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
                    value={situationDescription.value}
                    onChange={situationDescription.handleChange}
                    {...situationDescription.input.props}
                    {...UI.Form.textareaPattern(loaderData.situationDescription)}
                  />
                </div>

                <div data-display="flex" data-gap="12">
                  <div data-display="flex" data-direction="column">
                    <label className="c-label" htmlFor="situationKind">
                      Kind
                    </label>

                    <Select id="situationKind" name="situationKind" required className="c-select">
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
                      value={situationLocation.value}
                      onChange={situationLocation.handleChange}
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

              <div data-display="flex" data-gap="12">
                <div data-display="flex" data-direction="column">
                  <label className="c-label" htmlFor="emotionLabel">
                    Label
                  </label>

                  <Select id="emotionLabel" name="emotionLabel" required className="c-select">
                    {loaderData.emotionLabels.map((emotion) => (
                      <option key={emotion} value={emotion}>
                        {emotion}
                      </option>
                    ))}
                  </Select>
                </div>

                <div data-display="flex" data-direction="column">
                  <label className="c-label" htmlFor="emotionIntensity">
                    Intensity
                  </label>
                  <input
                    id="emotionIntensity"
                    name="emotionIntensity"
                    className="c-input"
                    type="number"
                    defaultValue={loaderData.emotionIntensity.min}
                    {...loaderData.emotionIntensity}
                  />
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
                    value={reactionDescription.value}
                    onChange={reactionDescription.handleChange}
                    {...reactionDescription.input.props}
                    {...UI.Form.textareaPattern(loaderData.reactionDescription)}
                  />
                </div>

                <div data-display="flex" data-gap="12">
                  <div data-display="flex" data-direction="column">
                    <label className="c-label" htmlFor="reactionType">
                      Type
                    </label>

                    <Select id="reactionType" name="reactionType" required className="c-select">
                      {loaderData.reactionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div data-display="flex" data-direction="column">
                    <label className="c-label" htmlFor="reactionEffectiveness">
                      Effectiveness
                    </label>
                    <input
                      id="reactionEffectiveness"
                      name="reactionEffectiveness"
                      className="c-input"
                      type="number"
                      defaultValue={loaderData.emotionIntensity.min}
                      {...loaderData.reactionEffectiveness}
                    />
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
              disabled={UI.Fields.anyUnchanged([
                situationDescription,
                // TODO situationKind,
                situationLocation,
              ])}
              {...UI.Rhythm().times(10).style.minWidth}
            >
              Add emotion
            </button>
          )}

          {step === "emotion" && (
            <div data-display="flex" data-gap="12" data-ml="auto" data-mt="auto">
              <button
                onClick={() => setStep("situation")}
                type="button"
                className="c-button"
                data-variant="bare"
              >
                Back
              </button>
              <button
                onClick={() => setStep("reaction")}
                type="button"
                className="c-button"
                data-variant="secondary"
                disabled={UI.Fields.anyUnchanged([
                  // TODO emotionLabel,
                  // TODO emotionIntensity,
                ])}
                {...UI.Rhythm().times(10).style.minWidth}
              >
                Add reaction
              </button>
            </div>
          )}

          {step === "reaction" && (
            <div data-display="flex" data-gap="12" data-ml="auto" data-mt="auto">
              <button
                onClick={() => setStep("emotion")}
                type="button"
                className="c-button"
                data-variant="bare"
              >
                Back
              </button>
              <button
                type="submit"
                className="c-button"
                data-variant="primary"
                disabled={UI.Fields.anyUnchanged([
                  reactionDescription,
                  // TODO reactionType,
                  // TODO reactionEffectiveness,
                ])}
                {...UI.Rhythm().times(10).style.minWidth}
              >
                Add
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
