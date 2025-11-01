import { exec, useNumberField, useTextField, useToggle, useTranslations, WeakETag } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-add-form";
import type { EntrySnapshotFormatted } from "../api";
import { ButtonCancel, EntryEmotionLabel, RatingPillsClickable, Select } from "../components";
import { homeRoute } from "../router";
import { useMutation } from "../sections/use-mutation";

export function EntryEmotion(props: EntrySnapshotFormatted) {
  const t = useTranslations();
  const router = useRouter();

  const emotionLabelEdit = useToggle({ name: "emotion-label" });
  const emotionLabel = useTextField<types.EmotionLabelType>({
    ...Form.emotionLabel.field,
    defaultValue: props.emotionLabel as types.EmotionLabelType,
  });

  const emotionIntensity = useNumberField<types.EmotionIntensityType>({
    ...Form.emotionIntensity.field,
    defaultValue: props.emotionIntensity as types.EmotionIntensityType,
  });

  const mutation = useMutation({
    perform: () =>
      fetch(`/api/entry/${props.id}/reappraise-emotion`, {
        method: "POST",
        credentials: "include",
        headers: WeakETag.fromRevision(props.revision),
        body: JSON.stringify({ label: emotionLabel.value, intensity: emotionIntensity.value }),
      }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === homeRoute.id, sync: true }),
  });

  // biome-ignore lint: lint/correctness/useExhaustiveDependencies
  useEffect(() => {
    if (emotionIntensity.changed || emotionLabel.changed) mutation.mutate();
  }, [emotionIntensity.changed, emotionLabel.changed]);

  return (
    <div data-stack="x" data-gap="5" data-mt="2">
      {emotionLabelEdit.off && (
        <EntryEmotionLabel
          emotionLabel={props.emotionLabel}
          data-cursor="pointer"
          onClick={emotionLabelEdit.enable}
        />
      )}

      {emotionLabelEdit.on && (
        <div data-stack="x" data-gap="2" data-mr="2">
          <Select
            {...emotionLabel.input.props}
            disabled={mutation.isLoading}
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
          </Select>

          <ButtonCancel
            type="submit"
            disabled={mutation.isLoading}
            onClick={exec([emotionLabel.clear, emotionLabelEdit.disable])}
          />
        </div>
      )}

      <RatingPillsClickable {...emotionIntensity} />
    </div>
  );
}
