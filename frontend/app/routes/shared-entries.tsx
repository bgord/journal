import type { SelectEntriesWithAlarms } from "../../../infra/schema";
import { API } from "../../api";
import * as Components from "../../components";
import type { Route } from "./+types/shared-entries";

export async function loader({ params }: Route.LoaderArgs) {
  const result = await API(`/shared/entries/${params.shareableLinkId}`, { method: "GET" });
  return (await result.json()) as SelectEntriesWithAlarms[];
}

export default function SharedEntries() {
  return (
    <main data-stack="y">
      <header data-stack="x" data-main="between" data-cross="center" data-p="3">
        <Components.Logo />
        <Components.LanguageSelector />
      </header>
      Shared entries
    </main>
  );
}
