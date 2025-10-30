import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form } from "../../app/services/home-entry-list-form";

export function Logo() {
  const t = useTranslations();

  return (
    <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
      <Link to="/" search={Form.default}>
        {t("app.name")}
      </Link>
    </div>
  );
}
