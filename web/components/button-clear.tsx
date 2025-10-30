import { useTranslations } from "@bgord/ui";

export function ButtonClear(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button type="button" className="c-button" data-variant="bare" {...props}>
      {t("app.clear")}
    </button>
  );
}
