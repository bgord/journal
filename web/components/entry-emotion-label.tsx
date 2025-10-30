import { useTranslations } from "@bgord/ui";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";

export function EntryEmotionLabel(
  props: Pick<EntrySnapshotWithAlarmsFormatted, "emotionLabel"> & React.JSX.IntrinsicElements["div"],
) {
  const t = useTranslations();
  const { emotionLabel, ...rest } = props;

  return (
    <div className="c-badge" data-variant="outline" {...rest}>
      {t(`entry.emotion.label.value.${emotionLabel}`)}
    </div>
  );
}
