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
    <div data-stack="x" data-cross="center" data-gap="3" data-my="8">
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
        max={form.date.max.today()}
        {...dateRangeEnd.input.props}
      />
      <Select {...strategy.input.props}>
        {Form.strategy.options.map((strategy) => (
          <option key={strategy} value={strategy}>
            {t(`entries.export.format.${strategy}`)}
          </option>
        ))}
      </Select>
      <a type="button" href={url} download target="_blank" className="c-button" data-variant="secondary">
        {t("entries.export.cta")}
      </a>
      <ButtonClear
        disabled={Fields.allUnchanged([dateRangeStart, dateRangeEnd, strategy])}
        onClick={exec([dateRangeStart.clear, dateRangeEnd.clear, strategy.clear])}
      />
    </div>
  );
}
