import { useTextField, useTranslations } from "@bgord/ui";
import { Form } from "../../app/services/home-entry-list-form";
import * as Components from "../components";
import { homeRoute } from "../router";
import { HomeEntry } from "./home-entry";

export function HomeEntryList() {
  const t = useTranslations();
  const { entries } = homeRoute.useLoaderData();
  const filter = useTextField({ name: Form.filter.field.name, defaultValue: Form.filter.field.defaultValue });

  return (
    <div data-stacky="y">
      <Components.Select {...filter.input.props}>
        {Form.filter.options.map((option) => (
          <option key={option} value={option}>
            {t(`entry.list.filter.${option}`)}
          </option>
        ))}
      </Components.Select>

      {entries[0] && (
        <ul data-stack="y" data-gap="5" data-mt="6">
          {entries.map((entry) => (
            <HomeEntry key={entry.id} {...entry} />
          ))}
        </ul>
      )}

      {!entries[0] && <Components.EntryListEmpty />}
    </div>
  );
}
