import * as UI from "@bgord/ui";

type AddEntryNavigationStep = "situation" | "emotion" | "reaction";

export function AddEntryNavigationProgress(props: { step: AddEntryNavigationStep }) {
  const progress = props.step === "situation" ? "33%" : props.step === "emotion" ? "66%" : "100%";

  return (
    <div
      data-my="6"
      data-interaction="grow"
      data-bg="brand-500"
      style={{ width: progress, ...UI.Rhythm(8).times(1).height }}
    />
  );
}
