import { useTranslations } from "@bgord/ui";

export function EntryListEmpty() {
  const t = useTranslations();

  return (
    <div data-stack="y" data-cross="center">
      <img
        src="/public/notebook.svg"
        data-animation="grow-fade-in"
        height="300px"
        alt={t("entry.list.empty.alt")}
      />
      <div data-color="brand-300">{t("entry.list.empty")}</div>
    </div>
  );
}
