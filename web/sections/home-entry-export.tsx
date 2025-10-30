import * as bg from "@bgord/ui";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-export-form";
import * as UI from "../components";

export function HomeEntryExport() {
  const t = bg.useTranslations();

  const dateRangeStart = bg.useDateField(Form.dateRangeStart.field);
  const dateRangeEnd = bg.useDateField(Form.dateRangeEnd.field);
  const strategy = bg.useTextField<types.EntryExportStrategyType>(Form.strategy.field);

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
        max={bg.Form.date.max.today()}
        {...dateRangeEnd.input.props}
      />
      <UI.Select {...strategy.input.props}>
        {Form.strategy.options.map((strategy) => (
          <option value={strategy}>{t(`entries.export.format.${strategy}`)}</option>
        ))}
      </UI.Select>
      <a
        type="button"
        href={url}
        download
        target="_blank"
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
        disabled={bg.Fields.allUnchanged([dateRangeStart, dateRangeEnd, strategy])}
        onClick={bg.exec([dateRangeStart.clear, dateRangeEnd.clear, strategy.clear])}
      >
        {t("app.clear")}
      </button>
    </div>
  );
}
