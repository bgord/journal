import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";

export function Logo() {
  const t = useTranslations();

  return (
    <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
      <Link to="/">{t("app.name")}</Link>
    </div>
  );
}
