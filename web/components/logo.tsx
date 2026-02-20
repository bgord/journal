import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form } from "../../app/services/home-entry-list-form";

export function Logo() {
  const t = useTranslations();

  return (
    <div className="logo" data-color="brand-600" data-fs="2xl" data-fw="bold" data-ls="wider">
      <Link data-focus-ring="neutral" search={Form.default} to="/">
        {t("app.name")}
      </Link>
    </div>
  );
}
