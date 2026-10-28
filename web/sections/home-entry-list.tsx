import { Rhythm, useLoadMore, useTextField, useTranslations } from "@bgord/ui";
import * as HomeEntryListForm from "../../app/services/home-entry-list-form";
import { EntryListFilterOptions } from "../../modules/emotions/value-objects/entry-list-filter-options";
import { Entry } from "../api";
import { ButtonClear, EntryListEmpty, LoadMore, Select } from "../components";
import { homeRoute } from "../router";
import { HomeEntry } from "./home-entry";

export function HomeEntryList(props: React.JSX.IntrinsicElements["div"]) {
  const t = useTranslations();
  const { entries } = homeRoute.useLoaderData();
  const navigate = homeRoute.useNavigate();
  const search = homeRoute.useSearch();

  const filter = useTextField<HomeEntryListForm.types.EntryListFilterType>({
    name: HomeEntryListForm.Form.filter.field.name,
    defaultValue: search.filter ?? EntryListFilterOptions.last_week,
  });
  const query = useTextField({ name: HomeEntryListForm.Form.query.field.name, defaultValue: search.query });

  const list = useLoadMore({
    key: search,
    first: entries.data,
    load: async (cursor) => {
      const page = await Entry.getListPage(null, { ...search, cursor });

      return page?.data ?? null;
    },
  });

  return (
    <div data-stack="y" data-width="100%">
      <div data-gap="3" data-md-gap="1" data-md-wrap="nowrap" data-stack="x">
        <input
          className="c-input"
          data-md-grow="1"
          onChange={(event) =>
            navigate({ to: "/", search: { ...search, query: event.currentTarget.value || undefined } })
          }
          placeholder={t("entry.list.search.placeholder")}
          value={query.input.props.value}
          {...Rhythm().times(5).style.minWidth}
        />
        <Select
          onChange={(event) =>
            navigate({ to: "/", search: { ...search, filter: event.currentTarget.value } })
          }
          value={filter.input.props.value}
        >
          {HomeEntryListForm.Form.filter.options.map((option) => (
            <option key={option} value={option}>
              {t(`entry.list.filter.${option}`)}
            </option>
          ))}
        </Select>

        <ButtonClear
          disabled={HomeEntryListForm.Form.isDefault(search)}
          onClick={() => navigate({ to: "/", search: HomeEntryListForm.Form.default })}
        />
      </div>

      {props.children}

      {!list.entries[0] && <EntryListEmpty />}

      {list.entries[0] && (
        <ul data-gap="5" data-mt="8" data-stack="y">
          {list.entries.map((entry) => (
            <HomeEntry key={entry.id} {...entry} />
          ))}
        </ul>
      )}

      <LoadMore list={list} />
    </div>
  );
}
