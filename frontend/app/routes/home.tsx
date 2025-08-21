import * as tools from "@bgord/tools";
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

  if (intent === "time_capsule_entry_add") {
    await API("/entry/time-capsule-entry/schedule", {
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
  const search = url.searchParams.get("search");
  const historyFor = url.searchParams.get("historyFor");

  const entries = await ReadModel.listEntriesForUser(userId, filter, search);

  const entryHistory = historyFor ? await ReadModel.listHistoryForEntry(historyFor) : [];

  return { entries, form: ReadModel.AddEntryForm, filter, entryHistory };
}

export type EntryType = Route.ComponentProps["loaderData"]["entries"][number];

export default function Home({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const dialog = UI.useToggle({ name: "dialog" });

  const filter = UI.useField({ strategy: UI.useFieldStrategyEnum.params, name: "filter", defaultValue: "" });
  const search = UI.useField({ strategy: UI.useFieldStrategyEnum.params, name: "search", defaultValue: "" });

  const dateRangeStart = UI.useField<number>({ name: "dateRangeStart", defaultValue: new Date().getTime() });
  const dateRangeEnd = UI.useField<number>({ name: "dateRangeEnd", defaultValue: new Date().getTime() });
  const strategy = UI.useField<string>({ name: "strategy", defaultValue: "text" });

  const dateRangeError = dateRangeStart.value > dateRangeEnd.value;

  const baseExportUrl = `${import.meta.env.VITE_API_URL}/entry/export-entries?dateRangeStart=${tools.DateFormatters.date(dateRangeStart.value)}&dateRangeEnd=${tools.DateFormatters.date(dateRangeEnd.value)}&strategy=${strategy.value}`;

  UI.useKeyboardShortcuts({ "$mod+Control+KeyN": dialog.enable });

  return (
    <main data-p="6">
      <div data-stack="x" data-main="between" data-cross="end" data-maxw="md" data-mx="auto">
        <div data-stack="x" data-cross="end" data-gap="3">
          <input
            className="c-input"
            placeholder={t("entry.list.search.placeholder")}
            data-grow="1"
            {...search.input.props}
          />

          <Components.Select {...filter.input.props}>
            <option value="">{t("entry.list.filter.all_time")}</option>
            <option value="today">{t("entry.list.filter.today")}</option>
            <option value="last_week">{t("entry.list.filter.last_week")}</option>
            <option value="last_month">{t("entry.list.filter.last_month")}</option>
          </Components.Select>

          <button
            type="button"
            className="c-button"
            data-variant="bare"
            onClick={UI.exec([filter.clear, search.clear])}
            disabled={filter.unchanged && search.unchanged}
          >
            Clear
          </button>
        </div>

        <Components.AddEntry />
      </div>

      <div data-stack="y" data-maxw="md" data-mx="auto" data-mt="6">
        <div data-stack="x" data-cross="center" data-gap="3" data-color="neutral-200">
          <input
            className="c-input"
            required
            type="date"
            {...dateRangeStart.input.props}
            value={
              dateRangeStart.value ? new Date(dateRangeStart.value).toISOString().split("T")[0] : undefined
            }
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) => dateRangeStart.set(event.currentTarget.valueAsNumber)}
          />
          -
          <input
            className="c-input"
            required
            type="date"
            {...dateRangeEnd.input.props}
            value={dateRangeEnd.value ? new Date(dateRangeEnd.value).toISOString().split("T")[0] : undefined}
            max={new Date().toISOString().split("T")[0]}
            onChange={(event) => dateRangeEnd.set(event.currentTarget.valueAsNumber)}
          />
          <Components.Select {...strategy.input.props}>
            <option value="text">Text</option>
            <option value="csv">CSV</option>
            <option value="markdown">Markdown</option>
            <option value="pdf">PDF</option>
          </Components.Select>
          <a
            type="button"
            href={baseExportUrl}
            download
            target="_blank"
            rel="noopener noreferer"
            className="c-button"
            data-variant="secondary"
            data-disp="flex"
            data-main="center"
            data-cross="center"
            data-mr="auto"
          >
            Export
          </a>
        </div>

        {dateRangeError && (
          <div data-mt="1" data-ml="1" data-fs="sm" data-color="danger-400">
            {t("profile.shareable_links.create.date_range.error")}
          </div>
        )}
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
