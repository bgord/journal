import * as UI from "@bgord/ui";

type AddEntryNavigationStep = "situation" | "emotion" | "reaction";

export function AddEntryNavigationProgress(props: { step: AddEntryNavigationStep }) {
  const progress = props.step === "situation" ? "33%" : props.step === "emotion" ? "66%" : "100%";

  return (
    <div
      data-my="6"
      data-interaction="grow"
      style={{ width: progress, ...UI.Rhythm(8).times(1).height, ...UI.Colorful("brand-500").background }}
    />
  );
}
