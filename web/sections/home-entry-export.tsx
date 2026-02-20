import { exec, Fields, Form as form, useDateField, useTextField, useTranslations } from "@bgord/ui";
import type { types } from "../../app/services/home-entry-add-form";
import { Form } from "../../app/services/home-entry-export-form";
import { ButtonClear, Select } from "../components";

export function HomeEntryExport() {
  const t = useTranslations();

  const dateRangeStart = useDateField(Form.dateRangeStart.field);
  const dateRangeEnd = useDateField(Form.dateRangeEnd.field);
  const strategy = useTextField<types.EntryExportStrategyType>(Form.strategy.field);

  const url = `/api/entry/export-entries?dateRangeStart=${dateRangeStart.value}&dateRangeEnd=${dateRangeEnd.value}&strategy=${strategy.value}`;

  return (
    <div data-cross="center" data-gap="3" data-my="8" data-stack="x">
      <input
        className="c-input"
        max={dateRangeEnd.value}
        required
        type="date"
        {...dateRangeStart.input.props}
      />
      -
      <input
        className="c-input"
        max={form.date.max.today()}
        required
        type="date"
        {...dateRangeEnd.input.props}
      />
      <Select {...strategy.input.props}>
        {Form.strategy.options.map((strategy) => (
          <option key={strategy} value={strategy}>
            {t(`entries.export.format.${strategy}`)}
          </option>
        ))}
      </Select>
      <a className="c-button" data-variant="secondary" download href={url} target="_blank" type="button">
        {t("entries.export.cta")}
      </a>
      <ButtonClear
        disabled={Fields.allUnchanged([dateRangeStart, dateRangeEnd, strategy])}
        onClick={exec([dateRangeStart.clear, dateRangeEnd.clear, strategy.clear])}
      />
    </div>
  );
}
