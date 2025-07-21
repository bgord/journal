import * as UI from "@bgord/ui";
import { Plus } from "iconoir-react";
import { Link } from "react-router";
import { API, emotionsApi } from "../../api";
import NotebookSvg from "../../assets/notebook.svg";
import { guard } from "../../auth";
import * as Components from "../../components";
import { ReadModel } from "../../read-model";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = UI.Cookies.extractFrom(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "entry_delete") {
    await emotionsApi.emotion;

    await API(`/entry/${form.get("id")}/delete`, {
      method: "DELETE",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
    });

    return { ok: true };
  }

  if (intent === "evaluate_reaction") {
    await API(`/entry/${form.get("id")}/evaluate-reaction`, {
      method: "POST",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });

    return { ok: true };
  }

  if (intent === "reappraise_emotion") {
    await API(`/entry/${form.get("id")}/reappraise-emotion`, {
      method: "POST",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });

    return { ok: true };
  }

  throw new Error("Intent unknown");
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await guard.getServerSession(request);
  const userId = session?.user.id as string;

  const entries = await ReadModel.listEntriesForUser(userId);

  return { entries, form: ReadModel.AddEntryForm };
}

export type EntryType = Route.ComponentProps["loaderData"]["entries"][number];

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
        {loaderData.entries.map((entry) => (
          <Components.Entry key={entry.id} {...entry} />
        ))}
      </ul>

      {loaderData.entries.length === 0 && (
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
