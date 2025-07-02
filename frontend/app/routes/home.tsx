import type { SelectEmotionJournalEntries } from "../../../infra/schema";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

export async function loader(): Promise<SelectEmotionJournalEntries[]> {
  const res = await fetch("http://localhost:3001/emotions/entries");
  return (await res.json()) as SelectEmotionJournalEntries[];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <header data-my="24" data-transform="center">
        Journal entries
      </header>

      <ul data-display="flex" data-direction="column" data-gap="24" data-max-width="768" data-mx="auto">
        {loaderData.map((entry) => (
          <li
            data-display="flex"
            data-py="12"
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
              data-gap="6"
              data-py="3"
              data-bcb="gray-200"
              data-bwb="1"
            >
              <div data-display="flex" data-gap="6">
                <div data-color="gray-600">What happened?</div>
                <div data-ml="auto" data-color="gray-800">
                  @{entry.situationLocation}
                </div>
                <div className="c-badge">{entry.situationKind}</div>
              </div>
              <div>{entry.situationDescription}</div>
            </section>

            {/* <div data-display="flex" data-gap="6"> */}
            {/*   <div data-fw="700">Emotion</div> */}
            {/*   <div className="c-badge">{entry.emotionLabel}</div> */}
            {/* </div> */}

            {/* <div data-display="flex" data-gap="6"> */}
            {/*   <div data-fw="700">Intensity:</div> */}
            {/*   {entry.emotionIntensity}/5 */}
            {/* </div> */}

            {/* <div data-display="flex" data-gap="6"> */}
            {/*   <div data-fw="700">Reacted with</div> */}
            {/*   <div className="c-badge">{entry.reactionType}</div> */}
            {/* </div> */}

            {/* <div>{entry.reactionDescription}</div> */}

            {/* <div data-display="flex" data-gap="6"> */}
            {/*   <div data-fw="700">Effectiveness:</div> */}
            {/*   {entry.reactionEffectiveness}/5 */}
            {/* </div> */}
          </li>
        ))}
      </ul>
    </main>
  );
}
