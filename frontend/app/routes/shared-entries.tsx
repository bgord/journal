import * as UI from "@bgord/ui";
import type { SelectEntriesFullWithAlarms } from "../../../infra/schema";
import { API } from "../../api";
import NotebookSvg from "../../assets/notebook.svg";
import * as Components from "../../components";
import type { Route } from "./+types/shared-entries";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const result = await API(`/shared/entries/${params.shareableLinkId}`, {
      method: "GET",
    });

    if (!result.ok) return [];

    const entries = await result.json();

    return entries as SelectEntriesFullWithAlarms[];
  } catch {
    return [];
  }
}

export default function SharedEntries({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();

  return (
    <main data-stack="y">
      <header data-stack="x" data-main="between" data-cross="center" data-p="3">
        <Components.Logo />
        <Components.LanguageSelector />
      </header>

      <ul data-stack="y" data-gap="5" data-maxw="md" data-mx="auto" data-mt="6">
        {loaderData.map((entry) => (
          <Components.ReadOnlyEntry key={entry.id} {...entry} />
        ))}
      </ul>

      {loaderData.length === 0 && (
        <div data-stack="y" data-cross="center">
          <img
            src={NotebookSvg}
            data-animation="grow-fade-in"
            height="300px"
            alt={t("entry.list.empty.alt")}
          />
          <div data-color="brand-300">{t("shared_entries.list.empty")}</div>
        </div>
      )}
    </main>
  );
}
