import { useTranslations } from "@bgord/ui";

export function ButtonClear(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button className="c-button" data-variant="bare" type="button" {...props}>
      {t("app.clear")}
    </button>
  );
}
