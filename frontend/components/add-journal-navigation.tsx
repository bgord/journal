export type AddJournalNavigationStep = "situation" | "emotion" | "reaction";

export function AddJournalNavigation(props: { step: AddJournalNavigationStep }) {
  const style = { style: { color: "var(--brand-700)" } };

  return (
    <div data-display="flex" data-mx="auto" data-gap="6" data-ls="0.5" data-mb="12">
      <div data-fs="14" data-fw={props.step === "situation" ? "700" : "300"} {...style}>
        SITUATION
      </div>
      <div data-fw="700">·</div>
      <div data-fs="14" data-fw={props.step === "emotion" ? "700" : "300"} {...style}>
        EMOTION
      </div>
      <div data-fw="700">·</div>
      <div data-fs="14" data-fw={props.step === "reaction" ? "700" : "300"} {...style}>
        REACTION
      </div>
    </div>
  );
}
