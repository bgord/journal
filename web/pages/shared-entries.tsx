import { EntryListEmpty, LanguageSelector, Logo } from "../components";
import { sharedEntries } from "../router";
import { SharedEntry } from "../sections/shared-entry";

/** @public */
export function SharedEntries() {
  const { entries } = sharedEntries.useLoaderData();

  return (
    <main data-md-m="2" data-md-pb="16" data-stack="y">
      <header data-cross="center" data-main="between" data-p="3" data-stack="x">
        <Logo />
        <LanguageSelector />
      </header>

      <ul data-gap="5" data-maxw="md" data-mt="6" data-mx="auto" data-stack="y" data-width="100%">
        {entries.map((entry) => (
          <SharedEntry key={entry.id} {...entry} />
        ))}
      </ul>

      {!entries[0] && <EntryListEmpty />}
    </main>
  );
}
