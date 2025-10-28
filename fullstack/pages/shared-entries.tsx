import * as UI from "../components";
import { sharedEntries } from "../router";
import { SharedEntry } from "../sections/shared-entry";

export function SharedEntries() {
  const { entries } = sharedEntries.useLoaderData();

  return (
    <main data-stack="y" data-pb="5">
      <header data-stack="x" data-main="between" data-cross="center" data-p="3">
        <UI.Logo />
        <UI.LanguageSelector />
      </header>

      <ul data-stack="y" data-gap="5" data-maxw="md" data-mx="auto" data-mt="6">
        {entries.map((entry) => (
          <SharedEntry key={entry.id} {...entry} />
        ))}
      </ul>

      {!entries[0] && <UI.EntryListEmpty />}
    </main>
  );
}
