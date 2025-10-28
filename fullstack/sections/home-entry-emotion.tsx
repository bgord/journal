import { exec, useNumberField, useTextField, useToggle, useTranslations, WeakETag } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import React from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import * as UI from "../components";
import type { EntryType } from "../entry.api";
import { homeRoute } from "../router";
import { RequestState } from "../ui";

export function EntryEmotion(props: EntryType) {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  const emotionLabelEdit = useToggle({ name: "emotion-label" });
  const emotionLabel = useTextField<types.EmotionLabelType>({
    ...Form.emotionLabel.field,
    defaultValue: props.emotionLabel as types.EmotionLabelType,
  });

  const emotionIntensity = useNumberField<types.EmotionIntensityType>({
    ...Form.emotionIntensity.field,
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
    <div data-stack="x" data-gap="5" data-mt="2">
      {emotionLabelEdit.off && (
        <UI.EntryEmotionLabel
          emotionLabel={props.emotionLabel}
          data-cursor="pointer"
          onClick={emotionLabelEdit.enable}
        />
      )}

      {emotionLabelEdit.on && (
        <div data-stack="x" data-gap="2" data-mr="2">
          <UI.Select
            {...emotionLabel.input.props}
            disabled={state === RequestState.loading}
            onChange={(event) => {
              emotionLabel.input.props.onChange(event);
              emotionLabelEdit.disable();
            }}
          >
            {Form.emotionLabel.options.map((emotion) => (
              <option key={emotion} value={emotion}>
                {t(`entry.emotion.label.value.${emotion}`)}
              </option>
            ))}
          </UI.Select>

          <UI.ButtonCancel
            type="submit"
            disabled={state === RequestState.loading}
            onClick={exec([emotionLabel.clear, emotionLabelEdit.disable])}
          />
        </div>
      )}

      <UI.RatingPillsClickable {...emotionIntensity} />
    </div>
  );
}
