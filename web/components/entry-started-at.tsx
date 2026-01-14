import type { EntrySnapshotFormatted } from "../api";

export function EntryStartedAt(
  props: Pick<EntrySnapshotFormatted, "startedAt"> & React.JSX.IntrinsicElements["div"],
) {
  const { startedAt, ...rest } = props;

  return (
    <div data-color="neutral-300" {...rest}>
      {startedAt}
    </div>
  );
}
