import type { EntryType } from "../api";

export function EntrySituationDescription(
  props: Pick<EntryType, "situationDescription"> & React.JSX.IntrinsicElements["div"],
) {
  const { situationDescription, ...rest } = props;

  return (
    <div data-color="neutral-200" {...rest}>
      {situationDescription}
    </div>
  );
}
