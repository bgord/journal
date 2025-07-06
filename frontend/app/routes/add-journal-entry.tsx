import * as UI from "@bgord/ui";
import React from "react";
import { redirect } from "react-router";
import type { EmotionIntensityType } from "../../../modules/emotions/value-objects/emotion-intensity";
import { EmotionIntensity } from "../../../modules/emotions/value-objects/emotion-intensity";
import type { EmotionLabelType } from "../../../modules/emotions/value-objects/emotion-label";
import { EmotionLabel } from "../../../modules/emotions/value-objects/emotion-label";
import type { ReactionDescriptionType } from "../../../modules/emotions/value-objects/reaction-description";
import { ReactionDescription } from "../../../modules/emotions/value-objects/reaction-description";
import type { ReactionEffectivenessType } from "../../../modules/emotions/value-objects/reaction-effectiveness";
import { ReactionEffectiveness } from "../../../modules/emotions/value-objects/reaction-effectiveness";
import type { ReactionTypeType } from "../../../modules/emotions/value-objects/reaction-type";
import { ReactionType } from "../../../modules/emotions/value-objects/reaction-type";
import type { SituationDescriptionType } from "../../../modules/emotions/value-objects/situation-description";
import { SituationDescription } from "../../../modules/emotions/value-objects/situation-description";
import type { SituationKindType } from "../../../modules/emotions/value-objects/situation-kind";
import { SituationKind } from "../../../modules/emotions/value-objects/situation-kind";
import type { SituationLocationType } from "../../../modules/emotions/value-objects/situation-location";
import { SituationLocation } from "../../../modules/emotions/value-objects/situation-location";
import { Select } from "../../components/select";
import type { Route } from "./+types/add-journal-entry";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader() {
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

export async function action({ request }: Route.ActionArgs) {
  const data = await request.formData();
  console.log(data);
  return redirect("/");
}

export default function AddJournalEntry({ loaderData }: Route.ComponentProps) {
  const [step, setStep] = React.useState<"situation" | "emotion" | "reaction">("situation");

  const situationDescription = UI.useField<SituationDescriptionType>({ name: "situation-description" });
  const situationLocation = UI.useField<SituationLocationType>({ name: "situation-location" });
  const situationKind = UI.useField<SituationKindType>({ name: "situation-kind" });
  const emotionLabel = UI.useField<EmotionLabelType>({ name: "emotion-label" });
  const emotionIntensity = UI.useField<EmotionIntensityType>({
    name: "emotion-intensity",
    defaultValue: loaderData.emotionIntensity.min,
  });
  const reactionDescription = UI.useField<ReactionDescriptionType>({ name: "reaction-description" });
  const reactionType = UI.useField<ReactionTypeType>({ name: "reaction-type" });
  const reactionEffectiveness = UI.useField<ReactionEffectivenessType>({
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
                    <label className="c-label" {...situationKind.label.props}>
                      Kind
                    </label>

                    <Select
                      className="c-select"
                      value={situationKind.value}
                      onChange={situationKind.handleChange}
                      {...situationKind.input.props}
                    >
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
                  <label className="c-label" {...emotionLabel.label.props}>
                    Label
                  </label>

                  <Select
                    className="c-select"
                    value={emotionLabel.value}
                    onChange={emotionLabel.handleChange}
                    {...emotionLabel.input.props}
                  >
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
                  <input
                    className="c-input"
                    type="number"
                    value={emotionIntensity.value}
                    onChange={emotionIntensity.handleChange}
                    {...emotionIntensity.input.props}
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
                    <label className="c-label" {...reactionType.label.props}>
                      Type
                    </label>

                    <Select
                      className="c-select"
                      value={reactionType.value}
                      onChange={reactionType.handleChange}
                      {...reactionType.input.props}
                    >
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
                    <input
                      className="c-input"
                      type="number"
                      value={reactionEffectiveness.value}
                      onChange={reactionEffectiveness.handleChange}
                      {...reactionEffectiveness.input.props}
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
              disabled={UI.Fields.anyUnchanged([situationDescription, situationKind, situationLocation])}
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
                disabled={UI.Fields.anyUnchanged([emotionLabel, emotionIntensity])}
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
                disabled={UI.Fields.anyUnchanged([reactionDescription, reactionType, reactionEffectiveness])}
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
