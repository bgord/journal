import { Rhythm, useLoadMore, useTextField, useTranslations } from "@bgord/ui";
import type { EntryListResponse } from "../../app/http/emotions/list-entries";
import * as HomeEntryListForm from "../../app/services/home-entry-list-form";
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
    defaultValue: search.filter as HomeEntryListForm.types.EntryListFilterType,
  });
  const query = useTextField({ name: HomeEntryListForm.Form.query.field.name, defaultValue: search.query });

  const list = useLoadMore({
    key: search,
    first: entries.data,
    load: async (cursor) => {
      const response = await fetch("/api/entry/list", {
        method: "QUERY",
        credentials: "include",
        body: JSON.stringify({ filter: search.filter, query: search.query ?? "", cursor }),
      });

      if (!response.ok) return null;

      const page: EntryListResponse = await response.json();

      return page.data;
    },
  });

  return (
    <div data-stack="y" data-width="100%">
      <div data-gap="3" data-md-gap="1" data-md-wrap="nowrap" data-stack="x">
        <input
          className="c-input"
          data-md-grow="1"
          onChange={(event) =>
            navigate({ to: "/", search: { query: event.currentTarget.value, filter: filter.value } })
          }
          placeholder={t("entry.list.search.placeholder")}
          value={query.input.props.value}
          {...Rhythm().times(5).style.minWidth}
        />
        <Select
          onChange={(event) =>
            navigate({ to: "/", search: { filter: event.currentTarget.value, query: query.value } })
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
          onClick={() => navigate({ to: "/", params: HomeEntryListForm.Form.default })}
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
