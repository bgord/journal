import type { EntrySnapshotFormatted } from "../api";

export function EntryReactionDescription(
  props: Pick<EntrySnapshotFormatted, "reactionDescription"> & React.JSX.IntrinsicElements["div"],
) {
  const { reactionDescription, ...rest } = props;

  return (
    <div data-color="neutral-200" {...rest}>
      {reactionDescription}
    </div>
  );
}
