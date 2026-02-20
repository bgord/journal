import { useTranslations } from "@bgord/ui";

export function EntryListEmpty() {
  const t = useTranslations();

  return (
    <div data-cross="center" data-stack="y">
      <img
        alt={t("entry.list.empty.alt")}
        data-animation="grow-fade-in"
        fetchPriority="high"
        height="300px"
        src="/public/notebook.svg"
      />
      <div data-color="brand-300">{t("entry.list.empty")}</div>
    </div>
  );
}
