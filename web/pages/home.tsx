import { useToggle } from "@bgord/ui";
import { Outlet } from "@tanstack/react-router";
import { MoreHoriz } from "iconoir-react";
import { HomeEntryAdd, HomeEntryExport, HomeEntryList } from "../sections";

/** @public */
export function Home() {
  const exportEntries = useToggle({ name: "entry-export" });

  return (
    <main data-stack="y" data-gap="3" data-maxw="md" data-mx="auto" data-mb="8">
      <div data-stack="x" data-gap="3">
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

      <HomeEntryList children={exportEntries.on ? <HomeEntryExport /> : null} />

      <Outlet />
    </main>
  );
}
