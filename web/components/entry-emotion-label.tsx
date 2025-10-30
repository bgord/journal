import { useTranslations } from "@bgord/ui";
import type { EntrySnapshotFormatted } from "../api";

export function EntryEmotionLabel(
  props: Pick<EntrySnapshotFormatted, "emotionLabel"> & React.JSX.IntrinsicElements["div"],
) {
  const t = useTranslations();
  const { emotionLabel, ...rest } = props;

  return (
    <div className="c-badge" data-variant="outline" {...rest}>
      {t(`entry.emotion.label.value.${emotionLabel}`)}
    </div>
  );
}
