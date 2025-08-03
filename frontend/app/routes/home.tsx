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

  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");

  const entries = await ReadModel.listEntriesForUser(userId, filter);

  return { entries, form: ReadModel.AddEntryForm, filter };
}

export type EntryType = Route.ComponentProps["loaderData"]["entries"][number];

export default function Home({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const dialog = UI.useToggle({ name: "dialog" });

  const filter = UI.useField({
    strategy: UI.useFieldStrategyEnum.params,
    name: "filter",
    defaultValue: "",
  });

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <main data-p="6">
      <div data-stack="x" data-main="between" data-cross="end" data-maxw="md" data-mx="auto">
        <div data-stack="x" data-cross="end" data-gap="3">
          <div data-stack="y">
            <label className="c-label" {...filter.label.props}>
              {t("entry.list.filter.label")}
            </label>
            <Components.Select {...filter.input.props}>
              <option value="">{t("entry.list.filter.all_time")}</option>
              <option value="today">{t("entry.list.filter.today")}</option>
              <option value="last_week">{t("entry.list.filter.last_week")}</option>
              <option value="last_month">{t("entry.list.filter.last_month")}</option>
            </Components.Select>
          </div>

          <button
            type="button"
            className="c-button"
            data-variant="bare"
            onClick={filter.clear}
            disabled={filter.unchanged}
          >
            Clear
          </button>
        </div>

        <Components.AddEntry />
      </div>

      <ul data-stack="y" data-gap="5" data-maxw="md" data-mx="auto" data-mt="6">
        {loaderData.entries.map((entry) => (
          <Components.Entry key={entry.id} {...entry} />
        ))}
      </ul>

      {loaderData.entries.length === 0 && (
        <div data-stack="y" data-cross="center">
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
