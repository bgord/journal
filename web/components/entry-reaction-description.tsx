import type { EntrySnapshotFormatted } from "../api";

export function EntryReactionDescription(
  props: Pick<EntrySnapshotFormatted, "reactionDescription"> & React.JSX.IntrinsicElements["div"],
) {
  const { reactionDescription, ...rest } = props;

  return <div {...rest}>{reactionDescription}</div>;
}
