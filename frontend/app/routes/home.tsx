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
      <header data-mb="24">Entries</header>
      <ul>
        {loaderData.map((entry) => (
          <li key={entry.id}>
            <div>
              Situation - {entry.situationKind} at {entry.situationLocation}
            </div>
            <div>{entry.situationDescription}</div>

            <div>
              {entry.emotionLabel} {entry.emotionIntensity}/5
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
