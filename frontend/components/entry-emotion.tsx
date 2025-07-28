import * as UI from "@bgord/ui";
import React from "react";
import * as RR from "react-router";

import type { types } from "../../app/services/add-entry-form";
import type { SelectEntriesFormatted } from "../../infra/schema";
import type { loader } from "../app/routes/home";

import { ClickableRatingPills } from "./clickable-rating-pills";
import { Select } from "./select";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export function EntryEmotion(props: SelectEntriesFormatted) {
  const t = UI.useTranslations();
  const fetcher = RR.useFetcher();
  const loader = RR.useLoaderData<LoaderData>();

  const editingEmotionLabel = UI.useToggle({ name: "emotion-label" });

  const emotionLabel = UI.useField<types.EmotionLabelType>({
    name: "label",
    defaultValue: props.emotionLabel as types.EmotionLabelType,
  });
  const emotionIntensity = UI.useField<types.EmotionIntensityType>({
    name: "intensity",
    defaultValue: props.emotionIntensity as types.EmotionIntensityType,
  });

  const reappraiseEmotion = () =>
    fetcher.submit(
      {
        id: props.id,
        revision: props.revision,
        intent: "reappraise_emotion",
        label: emotionLabel.value,
        intensity: emotionIntensity.value,
      },
      { method: "post", action: "." },
    );

  React.useEffect(() => {
    if (emotionIntensity.changed) reappraiseEmotion();
  }, [emotionIntensity.value]);

  React.useEffect(() => {
    if (emotionLabel.changed) reappraiseEmotion();
  }, [emotionLabel.value]);

  return (
    <div data-disp="flex" data-cross="center" data-gap="5" data-mt="2">
      {editingEmotionLabel.off && (
        <div
          className="c-badge"
          data-variant="primary"
          data-cursor="pointer"
          onClick={editingEmotionLabel.enable}
        >
          {t(`entry.emotion.label.value.${emotionLabel.value}`)}
        </div>
      )}

      {editingEmotionLabel.on && (
        <Select
          {...emotionLabel.input.props}
          onChange={(event) => {
            emotionLabel.input.props.onChange(event);
            editingEmotionLabel.disable();
          }}
        >
          {loader.form.emotionLabels
            .map((emotion) => emotion.option)
            .map((label: types.EmotionLabelType) => (
              <option key={label} value={label}>
                {t(`entry.emotion.label.value.${label}`)}
              </option>
            ))}
        </Select>
      )}

      <ClickableRatingPills {...emotionIntensity} />
    </div>
  );
}
