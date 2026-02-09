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
    <main data-stack="y" data-gap="3" data-maxw="md" data-mx="auto" data-md-m="2" data-md-pb="8">
      <div data-stack="x" data-gap="3">
        <div data-stack="x" data-gap="2" data-cross="center" data-color="neutral-400">
          <div className="c-badge" data-variant="primary" data-p="1" data-px="2">
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
          type="button"
          className="c-button"
          data-variant="with-icon"
          data-ml="auto"
          onClick={exportEntries.toggle}
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
