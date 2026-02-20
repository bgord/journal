import { useTranslations } from "@bgord/ui";

export function ButtonCancel(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button {...props} className="c-button" data-variant="bare" type="button">
      {t("app.cancel")}
    </button>
  );
}
