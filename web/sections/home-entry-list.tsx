import { useTextField, useTranslations } from "@bgord/ui";
import * as HomeEntryListForm from "../../app/services/home-entry-list-form";
import { EntryListEmpty, Select } from "../components";
import { homeRoute } from "../router";
import { HomeEntry } from "./home-entry";

export function HomeEntryList() {
  const t = useTranslations();
  const { entries } = homeRoute.useLoaderData();

  const navigate = homeRoute.useNavigate();

  const search = homeRoute.useSearch();

  const filter = useTextField<HomeEntryListForm.types.EntryListFilterType>({
    name: HomeEntryListForm.Form.filter.field.name,
    defaultValue: search.filter as HomeEntryListForm.types.EntryListFilterType,
  });
  const query = useTextField({ name: HomeEntryListForm.Form.query.field.name, defaultValue: search.query });

  return (
    <div data-stacky="y">
      <div data-stack="x" data-gap="5">
        <input
          className="c-input"
          placeholder={t("entry.list.search.placeholder")}
          value={query.input.props.value}
          onChange={(event) =>
            navigate({
              to: "/",
              search: { query: event.currentTarget.value, filter: filter.value },
            })
          }
        />
        <Select
          value={filter.input.props.value}
          onChange={(event) =>
            navigate({ to: "/", search: { filter: event.currentTarget.value, query: query.value } })
          }
        >
          {HomeEntryListForm.Form.filter.options.map((option) => (
            <option key={option} value={option}>
              {t(`entry.list.filter.${option}`)}
            </option>
          ))}
        </Select>

        <button
          className="c-button"
          type="button"
          data-variant="bare"
          disabled={filter.value === HomeEntryListForm.Form.filter.field.defaultValue && !query.value}
          onClick={() =>
            navigate({
              to: "/",
              params: {
                filter: HomeEntryListForm.Form.filter.field.defaultValue,
                query: HomeEntryListForm.Form.query.field.defaultValue,
              },
            })
          }
        >
          {t("app.clear")}
        </button>
      </div>

      {entries[0] && (
        <ul data-stack="y" data-gap="5" data-mt="6">
          {entries.map((entry) => (
            <HomeEntry key={entry.id} {...entry} />
          ))}
        </ul>
      )}

      {!entries[0] && <EntryListEmpty />}
    </div>
  );
}
