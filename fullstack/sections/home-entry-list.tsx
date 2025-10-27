import { useTranslations } from "@bgord/ui";
import { homeRoute } from "../router";
import { HomeEntry } from "./home-entry";

export function HomeEntryList() {
  const t = useTranslations();
  const { entries } = homeRoute.useLoaderData();

  return (
    <div data-stacky="y">
      {entries[0] && (
        <ul data-stack="y" data-gap="5" data-mt="6">
          {entries.map((entry) => (
            <HomeEntry key={entry.id} {...entry} />
          ))}
        </ul>
      )}

      {!entries[0] && (
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
