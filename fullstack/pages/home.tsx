import * as UI from "@bgord/ui";
import { Outlet } from "@tanstack/react-router";
import { MoreHoriz } from "iconoir-react";
import { HomeEntryAdd } from "../sections/home-entry-add";
import { HomeEntryExport } from "../sections/home-entry-export";
import { HomeEntryList } from "../sections/home-entry-list";

export function Home() {
  const exportEntries = UI.useToggle({ name: "entry-export" });

  return (
    <main data-p="6" data-stack="y" data-maxw="md" data-mx="auto" data-gap="3">
      <div data-stack="x" data-main="end" data-gap="3">
        <button
          type="button"
          className="c-button"
          data-variant="with-icon"
          data-ml="auto"
          onClick={exportEntries.toggle}
        >
          <MoreHoriz data-size="md" />
        </button>
        <HomeEntryAdd />
      </div>

      {exportEntries.on && <HomeEntryExport />}

      <HomeEntryList />

      <Outlet />
    </main>
  );
}
