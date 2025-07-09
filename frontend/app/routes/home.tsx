import * as UI from "@bgord/ui";
import { Plus } from "iconoir-react";
import { Link } from "react-router";
import type { SelectEmotionJournalEntries } from "../../../infra/schema";
import { API } from "../../api";
import { Entry } from "../../components/entry";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader() {
  const response = await API("/emotions/entries");
  const entries = (await response.json()) as SelectEmotionJournalEntries[];

  return entries.map((entry) => ({ ...entry, startedAt: new Date(entry.startedAt).toLocaleString() }));
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main data-pb="36">
      <ul
        className="entries-list"
        data-display="flex"
        data-direction="column"
        data-gap="24"
        data-max-width="768"
        data-mx="auto"
      >
        {loaderData.map((entry) => (
          <Entry key={entry.id} {...entry} />
        ))}
      </ul>

      <Link
        to="/add-journal-entry"
        type="button"
        className="c-button"
        data-variant="with-icon"
        data-position="fixed"
        data-bottom="24"
        data-right="24"
        data-shadow="sm"
        data-interaction="rotate-into-focus"
        viewTransition
        title="Add journal entry"
        style={{
          background: "var(--brand-200)",
          color: "var(--brand-500)",
          ...UI.Rhythm(16).times(4).square,
        }}
      >
        <Plus height="36" width="36" />
      </Link>
    </main>
  );
}
