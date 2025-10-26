import { useTranslations } from "@bgord/ui";
import { useLoaderData } from "@tanstack/react-router";
import { homeRoute } from "../router";

export function HomeEntryList() {
  const t = useTranslations();
  const { entries } = useLoaderData({ from: homeRoute.id });

  return (
    <div>
      {entries.length === 0 && (
        <div data-stack="y" data-cross="center">
          <img
            src="/public/notebook.svg"
            data-animation="grow-fade-in"
            height="300px"
            alt={t("entry.list.empty.alt")}
          />
          <div data-color="brand-300">{t("entry.list.empty")}</div>
        </div>
      )}
    </div>
  );
}
