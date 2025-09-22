import * as tools from "@bgord/tools";
import * as UI from "@bgord/ui";
import * as Components from "../components";

export function ExportEntries() {
  const t = UI.useTranslations();

  const dateRangeStart = UI.useField<number>({ name: "dateRangeStart", defaultValue: Date.now() });
  const dateRangeEnd = UI.useField<number>({ name: "dateRangeEnd", defaultValue: Date.now() });
  const strategy = UI.useField<string>({ name: "strategy", defaultValue: "text" });

  const dateRangeError = dateRangeStart.value > dateRangeEnd.value;

  const baseExportUrl = `${import.meta.env.VITE_API_URL}/entry/export-entries?dateRangeStart=${tools.DateFormatters.date(dateRangeStart.value)}&dateRangeEnd=${tools.DateFormatters.date(dateRangeEnd.value)}&strategy=${strategy.value}`;

  return (
    <div data-stack="y" data-maxw="md" data-mx="auto" data-my="8">
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
  );
}
