import { EntryListEmpty } from "../components/entry-list-empty";
import { homeRoute } from "../router";
import { HomeEntry } from "./home-entry";

export function HomeEntryList() {
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

      {!entries[0] && <EntryListEmpty />}
    </div>
  );
}
