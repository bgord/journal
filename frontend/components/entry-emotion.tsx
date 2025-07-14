import * as UI from "@bgord/ui";
import type { SelectEntriesFormatted } from "../../infra/schema";
import { RatingPills } from "./rating-pills";

export function EntryEmotion(props: SelectEntriesFormatted) {
  const t = UI.useTranslations();

  return (
    <div data-display="flex" data-cross="center" data-gap="12">
      <div className="c-badge">{t(`entry.emotion.label.value.${props.emotionLabel}`)}</div>

      <RatingPills rating={props.emotionIntensity as number} total={5} />
    </div>
  );
}
