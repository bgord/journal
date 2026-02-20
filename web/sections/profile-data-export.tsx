import { useTranslations } from "@bgord/ui";
import { DownloadCircle } from "iconoir-react";

export function ProfileDataExport() {
  const t = useTranslations();

  return (
    <div data-cross="start" data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <DownloadCircle data-size="md" />
        <div>{t("profile.export_all_data.header")}</div>
      </div>

      <a
        className="c-button"
        data-variant="secondary"
        download
        href="/api/entry/export-data"
        rel="noopener"
        target="_blank"
      >
        {t("profile.export_all_data.cta")}
      </a>
    </div>
  );
}
