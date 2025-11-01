import { useTranslations } from "@bgord/ui";
import { DownloadCircle } from "iconoir-react";

export function ProfileDataExport() {
  const t = useTranslations();

  return (
    <div data-stack="y" data-cross="start" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <DownloadCircle data-size="md" />
        <div>{t("profile.export_all_data.header")}</div>
      </div>

      <a
        href="/api/entry/export-data"
        download
        target="_blank"
        className="c-button"
        data-variant="secondary"
        rel="noopener"
      >
        {t("profile.export_all_data.cta")}
      </a>
    </div>
  );
}
