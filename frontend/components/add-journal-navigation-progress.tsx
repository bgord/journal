import * as UI from "@bgord/ui";

export type AddJournalNavigationStep = "situation" | "emotion" | "reaction";

export function AddJournalNavigationProgress(props: { step: AddJournalNavigationStep }) {
  const progress = props.step === "situation" ? "33%" : props.step === "emotion" ? "66%" : "100%";

  return (
    <div
      data-my="6"
      data-interaction="grow"
      style={{ background: "var(--brand-500)", width: progress, ...UI.Rhythm(8).times(1).height }}
    />
  );
}
