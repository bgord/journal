import { useTranslations } from "@bgord/ui";
import { DownloadCircle } from "iconoir-react";

export function ProfileDataExport() {
  const t = useTranslations();

  return (
    <div data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <DownloadCircle data-size="md" />
        <div>{t("profile.export_all_data.header")}</div>
      </div>

      <a
        type="button"
        href="/api/entry/export-data"
        download
        target="_blank"
        rel="noopener noreferer"
        className="c-button"
        data-variant="secondary"
        data-disp="flex"
        data-main="center"
        data-cross="center"
        data-mr="auto"
      >
        {t("profile.export_all_data.cta")}
      </a>
    </div>
  );
}
