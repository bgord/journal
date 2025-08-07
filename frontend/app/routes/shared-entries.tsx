import type { SelectEntriesWithAlarms } from "../../../infra/schema";
import { API } from "../../api";
import * as Components from "../../components";
import type { Route } from "./+types/shared-entries";

export async function loader({ params }: Route.LoaderArgs) {
  const result = await API(`/shared/entries/${params.shareableLinkId}`, { method: "GET" });
  return (await result.json()) as (Omit<SelectEntriesWithAlarms, "startedAt"> & { startedAt: string })[];
}

export default function SharedEntries({ loaderData }: Route.ComponentProps) {
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
    </main>
  );
}
