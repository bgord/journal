import { usePluralize, useToggle, useTranslations } from "@bgord/ui";
import { Outlet } from "@tanstack/react-router";
import { MoreHoriz } from "iconoir-react";
import { homeRoute } from "../router";
import { HomeEntryAdd, HomeEntryExport, HomeEntryList } from "../sections";

/** @public */
export function Home() {
  const { entries } = homeRoute.useLoaderData();
  const t = useTranslations();
  const pluralize = usePluralize();
  const exportEntries = useToggle({ name: "entry-export" });

  return (
    <main data-gap="3" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <div data-gap="3" data-stack="x">
        <div data-color="neutral-400" data-cross="center" data-gap="2" data-stack="x">
          <div className="c-badge" data-p="1" data-px="2" data-variant="primary">
            {entries.length}
          </div>
          <div data-fs="sm">
            {pluralize({
              value: entries.length,
              singular: t("app.entry.singular"),
              plural: t("app.entry.plural"),
              genitive: t("app.entry.genitive"),
            })}
          </div>
        </div>

        <button
          className="c-button"
          data-ml="auto"
          data-variant="with-icon"
          onClick={exportEntries.toggle}
          type="button"
          {...exportEntries.props.controller}
        >
          <MoreHoriz data-size="md" />
        </button>

        <HomeEntryAdd />
      </div>

      <HomeEntryList>{exportEntries.on ? <HomeEntryExport /> : null}</HomeEntryList>

      <Outlet />
    </main>
  );
}
