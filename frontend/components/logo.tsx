import * as bg from "@bgord/ui";
import * as RR from "react-router";

export function Logo() {
  const t = bg.useTranslations();

  return (
    <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
      <RR.Link to="/">{t("app.name")}</RR.Link>
    </div>
  );
}
