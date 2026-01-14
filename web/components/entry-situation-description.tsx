import type { EntrySnapshotFormatted } from "../api";

export function EntrySituationDescription(
  props: Pick<EntrySnapshotFormatted, "situationDescription"> & React.JSX.IntrinsicElements["div"],
) {
  const { situationDescription, ...rest } = props;

  return <div {...rest}>{situationDescription}</div>;
}
