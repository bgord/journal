import { useTranslations } from "@bgord/ui";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";

export function EntrySituationKind(
  props: Pick<EntrySnapshotWithAlarmsFormatted, "situationKind"> & React.JSX.IntrinsicElements["div"],
) {
  const t = useTranslations();
  const { situationKind, ...rest } = props;

  return (
    <div className="c-badge" data-variant="outline" {...rest}>
      {t(`entry.situation.kind.value.${situationKind}`)}
    </div>
  );
}
