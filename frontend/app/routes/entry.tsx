import { redirect } from "react-router";
import { AddEntryForm } from "../../../app/services/add-entry-form";
import { API } from "../../api";
import type { Route } from "./+types/entry";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader() {
  return AddEntryForm.get();
}

export async function action({ request }: Route.ActionArgs) {
  await API("/entry/log", { method: "POST", body: JSON.stringify(await request.json()) });
  return redirect("/");
}

export default function Entry() {
  return <main data-pb="36">HERE</main>;
}
