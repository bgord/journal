import { exec, useNumberField, useTextField, useToggle, useTranslations, WeakETag } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { HomeEntryAddForm } from "../../app/services/home-entry-add-form";
import { ButtonCancel } from "../components/button-cancel";
import { RatingPillsClickable } from "../components/rating-pills-clickable";
import { Select } from "../components/select";
import type { EntrySnapshot } from "../entry.api";
import { homeRoute } from "../router";
import { RequestState } from "../ui";

export function EntryEmotion(props: EntrySnapshot) {
  const router = useRouter();
  const t = useTranslations();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  const emotionLabel = useTextField<types.EmotionLabelType>({
    name: "label",
    defaultValue: props.emotionLabel as types.EmotionLabelType,
  });
  const emotionLabelEdit = useToggle({ name: "emotion-label" });

  const emotionIntensity = useNumberField<types.EmotionIntensityType>({
    name: "intensity",
    defaultValue: props.emotionIntensity as types.EmotionIntensityType,
  });

  async function reappraiseEmotion() {
    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/entry/${props.id}/reappraise-emotion`, {
      method: "POST",
      credentials: "include",
      headers: WeakETag.fromRevision(props.revision),
      body: JSON.stringify({ label: emotionLabel.value, intensity: emotionIntensity.value }),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true });
  }

  React.useEffect(() => {
    if (emotionIntensity.changed || emotionLabel.changed) reappraiseEmotion();
  }, [emotionIntensity.value, emotionIntensity.changed, emotionLabel.value, emotionIntensity.changed]);

  return (
    <div data-stack="x" data-cross="center" data-gap="5" data-mt="2">
      {emotionLabelEdit.off && (
        <div
          className="c-badge"
          data-variant="primary"
          data-cursor="pointer"
          onClick={emotionLabelEdit.enable}
        >
          {t(`entry.emotion.label.value.${emotionLabel.value}`)}
        </div>
      )}

      {emotionLabelEdit.on && (
        <div data-stack="x" data-gap="2" data-mr="2">
          <Select
            {...emotionLabel.input.props}
            disabled={state === RequestState.loading}
            onChange={(event) => {
              emotionLabel.input.props.onChange(event);
              emotionLabelEdit.disable();
            }}
          >
            {HomeEntryAddForm.emotionLabel.options.map((emotion) => (
              <option key={emotion} value={emotion}>
                {t(`entry.emotion.label.value.${emotion}`)}
              </option>
            ))}
          </Select>

          <ButtonCancel
            type="submit"
            disabled={state === RequestState.loading}
            onClick={exec([emotionLabel.clear, emotionLabelEdit.disable])}
          />
        </div>
      )}

      <RatingPillsClickable {...emotionIntensity} />
    </div>
  );
}
