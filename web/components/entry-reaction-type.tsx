import { useTranslations } from "@bgord/ui";
import type React from "react";
import type { EntrySnapshotFormatted } from "../api";

export function EntryReactionType(
  props: Pick<EntrySnapshotFormatted, "reactionType"> & React.JSX.IntrinsicElements["button"],
) {
  const t = useTranslations();
  const { reactionType, ...rest } = props;

  return (
    <button className="c-badge" data-variant="primary" {...rest}>
      {t(`entry.reaction.type.value.${reactionType}`)}
    </button>
  );
}
