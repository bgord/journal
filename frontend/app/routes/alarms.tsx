export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

// export async function loader({ request }: Route.LoaderArgs) {
//   const cookie = UI.Cookies.extractFrom(request);

//   const response = await API("/entry/list", {
//     headers: { cookie },
//   });
//   const entries = (await response.json()) as SelectEntriesFull[];

//   return { entries, form: AddEntryForm.get() };
// }

export default function Home() {
  return <main data-pb="36">Alarms</main>;
}
