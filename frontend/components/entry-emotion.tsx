import * as UI from "@bgord/ui";
import React from "react";
import * as RR from "react-router";
import type { types } from "../../app/services/add-entry-form";
import type { SelectEntriesFormatted } from "../../infra/schema";
import { ClickableRatingPills } from "./clickable-rating-pills";

export function EntryEmotion(props: SelectEntriesFormatted) {
  const t = UI.useTranslations();
  const fetcher = RR.useFetcher();

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

  return (
    <div data-display="flex" data-cross="center" data-gap="12">
      <div className="c-badge">{t(`entry.emotion.label.value.${props.emotionLabel}`)}</div>

      <ClickableRatingPills {...emotionIntensity} />
    </div>
  );
}
