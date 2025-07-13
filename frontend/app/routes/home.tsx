import * as UI from "@bgord/ui";
import { Plus } from "iconoir-react";
import { Link } from "react-router";
import type { SelectEntriesFormatted } from "../../../infra/schema";
import { API } from "../../api";
import NotebookSvg from "../../assets/notebook.svg";
import * as Components from "../../components";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  await API(`/entry/${form.get("id")}/delete`, {
    method: "DELETE",
    headers: UI.WeakETag.fromRevision(Number(form.get("revision"))),
  });
  return { ok: true };
}

export async function loader() {
  const response = await API("/entry/list");
  const entries = (await response.json()) as SelectEntriesFormatted[];

  return entries;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();

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
          <Components.HomeEntry key={entry.id} {...entry} />
        ))}
      </ul>

      {loaderData.length === 0 && (
        <div data-display="flex" data-direction="column" data-cross="center">
          <img
            src={NotebookSvg}
            data-animation="grow-fade-in"
            height="300px"
            alt={t("entry.list.empty.alt")}
          />
          <div {...UI.Colorful("brand-600").style.color}>{t("entry.list.empty")}</div>
        </div>
      )}

      <Link
        to="/add-entry"
        type="button"
        className="c-button"
        data-variant="with-icon"
        data-position="fixed"
        data-bottom="24"
        data-right="24"
        data-shadow="sm"
        data-interaction="rotate-into-focus"
        viewTransition
        title={t("entry.add.title")}
        style={{
          ...UI.Colorful("brand-150").background,
          ...UI.Colorful("brand-700").color,
          ...UI.Rhythm(16).times(4).square,
        }}
      >
        <Plus height="36" width="36" />
      </Link>
    </main>
  );
}
