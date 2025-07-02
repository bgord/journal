import { RatingPills } from ".../../components/rating-pills";
import type { SelectEmotionJournalEntries } from "../../../infra/schema";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader(): Promise<SelectEmotionJournalEntries[]> {
  const res = await fetch("http://localhost:3001/emotions/entries");
  return (await res.json()) as SelectEmotionJournalEntries[];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main data-py="36">
      <header data-mb="36" data-fs="20" data-color="gray-600" data-transform="center">
        Journal entries
      </header>

      <ul data-display="flex" data-direction="column" data-gap="24" data-max-width="768" data-mx="auto">
        {loaderData.map((entry) => (
          <li
            data-display="flex"
            data-pt="24"
            data-px="48"
            data-direction="column"
            data-fs="14"
            data-bc="gray-200"
            data-bw="1"
            key={entry.id}
          >
            <header data-fw="700">{new Date(entry.startedAt).toLocaleString()}</header>

            <section
              data-display="flex"
              data-direction="column"
              data-gap="12"
              data-py="24"
              data-bcb="gray-200"
              data-bwb="1"
            >
              <div data-display="flex" data-gap="6">
                <div data-color="gray-600">What happened?</div>

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
                <div data-color="gray-600" data-mr="auto">
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
