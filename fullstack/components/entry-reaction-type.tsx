import { useTranslations } from "@bgord/ui";
import type React from "react";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";

export function EntryReactionType(
  props: Pick<EntrySnapshotWithAlarmsFormatted, "reactionType"> & React.JSX.IntrinsicElements["div"],
) {
  const t = useTranslations();
  const { reactionType, ...rest } = props;

  return (
    <div className="c-badge" data-variant="primary" {...rest}>
      {t(`entry.reaction.type.value.${reactionType}`)}
    </div>
  );
}
