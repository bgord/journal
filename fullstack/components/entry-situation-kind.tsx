import { useTranslations } from "@bgord/ui";
import type { EntryType } from "../entry.api";

export function EntrySituationKind(
  props: Pick<EntryType, "situationKind"> & React.JSX.IntrinsicElements["div"],
) {
  const t = useTranslations();
  const { situationKind, ...rest } = props;

  return (
    <div className="c-badge" data-variant="outline" {...rest}>
      {t(`entry.situation.kind.value.${situationKind}`)}
    </div>
  );
}
