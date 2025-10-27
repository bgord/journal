import type { EntryType } from "../entry.api";

export function EntryReactionDescription(
  props: Pick<EntryType, "reactionDescription"> & React.JSX.IntrinsicElements["div"],
) {
  const { reactionDescription, ...rest } = props;

  return (
    <div data-color="neutral-200" {...rest}>
      {reactionDescription}
    </div>
  );
}
