import * as UI from "@bgord/ui";
import { API } from "../../api";
import NotebookSvg from "../../assets/notebook.svg";
import * as Auth from "../../auth";
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

  if (intent === "entry_add") {
    await API("/entry/log", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form.entries())),
      headers: { cookie },
    });
    return { ok: true };
  }

  if (intent === "entry_delete") {
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
  const session = await Auth.guard.getServerSession(request);
  const userId = session?.user.id as string;

  const entries = await ReadModel.listEntriesForUser(userId);

  return { entries, form: ReadModel.AddEntryForm };
}

export type EntryType = Route.ComponentProps["loaderData"]["entries"][number];

export default function Home({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const dialog = UI.useToggle({ name: "dialog" });

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <main data-p="6">
      <div data-stack="x" data-main="end" data-maxw="md" data-mx="auto">
        <Components.AddEntry />
      </div>

      <ul data-stack="y" data-gap="5" data-maxw="md" data-mx="auto">
        {loaderData.entries.map((entry) => (
          <Components.Entry key={entry.id} {...entry} />
        ))}
      </ul>

      {loaderData.entries.length === 0 && (
        <div data-stack="x" data-cross="center">
          <img
            src={NotebookSvg}
            data-animation="grow-fade-in"
            height="300px"
            alt={t("entry.list.empty.alt")}
          />
          <div data-color="brand-300">{t("entry.list.empty")}</div>
        </div>
      )}
    </main>
  );
}
