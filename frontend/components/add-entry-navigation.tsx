import * as UI from "@bgord/ui";

export type AddEntryNavigationStep = "situation" | "emotion" | "reaction";

export function AddEntryNavigation(props: { step: AddEntryNavigationStep }) {
  const t = UI.useTranslations();

  return (
    <div
      data-disp="flex"
      data-cross="center"
      data-gap="3"
      data-mx="auto"
      data-color="neutral-300"
      data-ls="tight"
    >
      <div data-fs="sm" data-fw={props.step === "situation" ? "bold" : "light"}>
        {t("entry.situation.value")}
      </div>

      <div data-fw="bold">-</div>

      <div data-fs="sm" data-fw={props.step === "emotion" ? "bold" : "light"}>
        {t("entry.emotion.value")}
      </div>

      <div data-fw="bold">-</div>

      <div data-fs="sm" data-fw={props.step === "reaction" ? "bold" : "light"}>
        {t("entry.reaction.value")}
      </div>
    </div>
  );
}
