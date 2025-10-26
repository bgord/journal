import * as UI from "@bgord/ui";
import type { types } from "../../app/services/home-entry-add-form";
import { HomeEntryExportForm } from "../../app/services/home-entry-export-form";
import { Select } from "../components/select";

export function HomeEntryExport() {
  const t = UI.useTranslations();

  const dateRangeStart = UI.useDateField({
    name: "dateRangeStart",
    defaultValue: UI.Form.date.min.yesterday(),
  });
  const dateRangeEnd = UI.useDateField({ name: "dateRangeEnd", defaultValue: UI.Form.date.min.today() });

  const strategy = UI.useTextField<types.ExportEntriesStrategyType>({
    name: "strategy",
    defaultValue: HomeEntryExportForm.strategy.defaultValue,
  });

  const url = `/api/entry/export-entries?dateRangeStart=${dateRangeStart.value}&dateRangeEnd=${dateRangeEnd.value}&strategy=${strategy.value}`;

  return (
    <div data-stack="x" data-cross="center" data-gap="3" data-my="8" data-color="neutral-200">
      <input
        className="c-input"
        required
        type="date"
        max={dateRangeEnd.value}
        {...dateRangeStart.input.props}
      />
      -
      <input
        className="c-input"
        required
        type="date"
        max={UI.Form.date.max.today()}
        {...dateRangeEnd.input.props}
      />
      <Select {...strategy.input.props}>
        {HomeEntryExportForm.strategy.options.map((strategy) => (
          <option value={strategy}>{t(`entries.export.format.${strategy}`)}</option>
        ))}
      </Select>
      <a
        type="button"
        href={url}
        download
        target="_blank"
        rel="noopener noreferer"
        className="c-button"
        data-variant="secondary"
        data-disp="flex"
        data-main="center"
        data-cross="center"
      >
        {t("entries.export.cta")}
      </a>
      <button
        className="c-button"
        data-variant="bare"
        type="button"
        disabled={UI.Fields.allUnchanged([dateRangeStart, dateRangeEnd, strategy])}
        onClick={UI.exec([dateRangeStart.clear, dateRangeEnd.clear, strategy.clear])}
      >
        {t("app.clear")}
      </button>
    </div>
  );
}
