import * as UI from "@bgord/ui";

export function BackButton(props: React.JSX.IntrinsicElements["button"]) {
  const t = UI.useTranslations();

  return (
    <button {...props} type="button" className="c-button" data-variant="bare">
      {t("app.back")}
    </button>
  );
}
