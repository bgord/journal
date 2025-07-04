import * as UI from "@bgord/ui";
import { DesignPencil } from "iconoir-react";
import type { SelectEmotionJournalEntries } from "../../../infra/schema";
import { API } from "../../api";
import { RatingPills } from "../../components/rating-pills";
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
  const addJournalEntryToggle = UI.hooks.useToggle({ name: "add-journal-entry", defaultValue: true });

  return (
    <main data-pb="36">
      <header
        data-my="48"
        data-fs="32"
        data-fw="700"
        data-transform="center uppercase"
        data-ls="1.5"
        className="logo"
      >
        Journal
      </header>

      <div data-display="flex" data-direction="column" data-max-width="768" data-mx="auto" data-mb="12">
        <button
          onClick={addJournalEntryToggle.toggle}
          type="button"
          className="c-button"
          data-variant="with-icon"
          title="Add journal entry"
          data-self="end"
        >
          <DesignPencil height="24" width="24" />
        </button>

        {addJournalEntryToggle.on && (
          <form
            data-display="flex"
            data-direction="column"
            data-shadow="sm"
            data-p="12"
            data-gap="12"
            data-bc="gray-200"
            data-bw="1"
            data-br="4"
            style={{ background: "var(--surface-card)" }}
          >
            <legend data-fs="16" data-fw="700" data-transform="center uppercase" data-ls="1.5">
              Add journal entry
            </legend>

            <div data-display="flex" data-direction="column">
              <label className="c-label" htmlFor="situationDescription">
                Situation description
              </label>
              <input
                id="situationDescription"
                name="situationDescription"
                required
                className="c-input"
                type="text"
              />
            </div>

            <div data-display="flex" data-direction="column">
              <label className="c-label" htmlFor="situationLocation">
                Situation location
              </label>
              <input
                id="situationLocation"
                name="situationLocation"
                required
                className="c-input"
                type="text"
              />
            </div>

            <div data-display="flex" data-direction="column">
              <label className="c-label" htmlFor="situationKind">
                Situation kind
              </label>

              <input id="situationKind" name="situationKind" required className="c-input" type="text" />
            </div>

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              data-ml="auto"
              style={{ width: "72px" }}
            >
              Add
            </button>
          </form>
        )}
      </div>

      <ul data-display="flex" data-direction="column" data-gap="24" data-max-width="768" data-mx="auto">
        {loaderData.map((entry) => (
          <li
            style={{ background: "var(--surface-card)" }}
            data-display="flex"
            data-pt="24"
            data-px="48"
            data-direction="column"
            data-fs="14"
            data-bc="gray-200"
            data-bw="1"
            data-br="4"
            data-shadow="sm"
            key={entry.id}
          >
            <header data-fs="16" data-fw="700" data-color="gray-700">
              {entry.startedAt}
            </header>

            <section
              data-display="flex"
              data-direction="column"
              data-gap="12"
              data-py="24"
              data-bcb="gray-200"
              data-bwb="1"
            >
              <div data-display="flex" data-gap="6">
                <div data-color="gray-500">What happened?</div>

                <div data-ml="auto" data-color="gray-700">
                  @{entry.situationLocation}
                </div>

                <div className="c-badge">{entry.situationKind}</div>
              </div>

              <div data-display="flex" data-main="between" data-cross="center" data-gap="12">
                <div>{entry.situationDescription}</div>

                <div data-display="flex" data-cross="center" data-gap="12">
                  <div className="c-badge">{entry.emotionLabel}</div>

                  <RatingPills rating={entry.emotionIntensity as number} total={5} />
                </div>
              </div>
            </section>

            <section data-display="flex" data-direction="column" data-gap="12" data-py="24">
              <div data-display="flex" data-cross="center" data-gap="12">
                <div data-color="gray-500" data-mr="auto">
                  What was your reaction?
                </div>

                <div className="c-badge">{entry.reactionType}</div>
                <RatingPills rating={entry.reactionEffectiveness as number} total={5} />
              </div>

              <div>{entry.reactionDescription}</div>
            </section>
          </li>
        ))}
      </ul>
    </main>
  );
}
