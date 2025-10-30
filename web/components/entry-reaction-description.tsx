import type { EntrySnapshotWithAlarmsFormatted } from "../api";

export function EntryReactionDescription(
  props: Pick<EntrySnapshotWithAlarmsFormatted, "reactionDescription"> & React.JSX.IntrinsicElements["div"],
) {
  const { reactionDescription, ...rest } = props;

  return (
    <div data-color="neutral-200" {...rest}>
      {reactionDescription}
    </div>
  );
}
