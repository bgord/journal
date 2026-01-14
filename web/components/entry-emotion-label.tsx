import { useTranslations } from "@bgord/ui";
import type { EntrySnapshotFormatted } from "../api";

export function EntryEmotionLabel(
  props: Pick<EntrySnapshotFormatted, "emotionLabel"> & React.JSX.IntrinsicElements["button"],
) {
  const t = useTranslations();
  const { emotionLabel, ...rest } = props;

  return (
    <button className="c-badge" data-variant="primary" {...rest}>
      {t(`entry.emotion.label.value.${emotionLabel}`)}
    </button>
  );
}
