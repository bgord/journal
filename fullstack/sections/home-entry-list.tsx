import { useTranslations } from "@bgord/ui";
import * as HomeEntryListForm from "../../app/services/home-entry-list-form";
import * as Components from "../components";
import { homeRoute } from "../router";
import { HomeEntry } from "./home-entry";
import { useTextField } from "./wip";

export function HomeEntryList() {
  const t = useTranslations();
  const { entries } = homeRoute.useLoaderData();

  const navigate = homeRoute.useNavigate();

  const search = homeRoute.useSearch();
  const filter = useTextField<HomeEntryListForm.types.EntryListFilterType>({
    name: HomeEntryListForm.Form.filter.field.name,
    defaultValue: search.filter as HomeEntryListForm.types.EntryListFilterType,
  });

  return (
    <div data-stacky="y">
      <Components.Select
        value={filter.input.props.value}
        onChange={(event) =>
          navigate({ to: "/", search: { filter: event.currentTarget.value }, replace: true })
        }
      >
        {HomeEntryListForm.Form.filter.options.map((option) => (
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
