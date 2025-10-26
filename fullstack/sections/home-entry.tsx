import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import type { EntrySnapshot } from "../entry.api";
// import type { EntryType } from "../app/routes/home";
// import { Alarm } from "./alarm";
// import { EntryEmotion } from "./entry-emotion";
// import { EntryHistory } from "./entry-history";
// import { EntryReaction } from "./entry-reaction";

export function HomeEntry(props: EntrySnapshot) {
  const t = UI.useTranslations();

  const deleteEntry = () => {};
  const exit = UI.useExitAction({ action: deleteEntry, animation: "shrink-fade-out" });

  if (!exit.visible) return null;

  return (
    <li
      {...exit.attach}
      data-testid="entry"
      data-stack="y"
      data-px="4"
      data-bg="neutral-900"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
    >
      <header
        data-stack="x"
        data-gap="3"
        data-cross="center"
        data-mt="2"
        {...UI.Rhythm().times(3).style.height}
      >
        {props.origin === "time_capsule" && <Icons.Timer data-size="sm" data-color="neutral-300" />}

        <div data-fs="base" data-fw="regular" data-color="neutral-300" data-mr="auto">
          {props.startedAt}
        </div>

        {/* <EntryHistory {...props} /> */}

        <form method="delete">
          <button
            className="c-button"
            data-variant="with-icon"
            type="submit"
            title={t("entry.delete.title")}
            // disabled={fetcher.state !== "idle"}
            data-interaction="subtle-scale"
            onClick={exit.trigger}
          >
            <Icons.Xmark data-size="md" />
          </button>
        </form>
      </header>

      <section data-stack="y" data-gap="5" data-py="5" data-bcb="neutral-700" data-bwb="hairline">
        <div data-stack="x" data-cross="center" data-gap="4">
          <div data-fs="sm" data-color="neutral-400">
            {t("entry.situation.description.label")}
          </div>

          <div className="c-badge" data-variant="outline">
            {t(`entry.situation.kind.value.${props.situationKind}`)}
          </div>
        </div>

        <div data-stack="x" data-main="between" data-cross="center" data-gap="12" data-color="neutral-200">
          {props.situationDescription}
        </div>

        {/* <EntryEmotion {...props} /> */}
      </section>

      {/* <EntryReaction {...props} /> */}

      {/* {props.alarms[0] && ( */}
      {/*   <ul data-stack="y" data-gap="5" data-mb="5"> */}
      {/*     {props.alarms.map((alarm) => ( */}
      {/*       <Alarm key={alarm.id} {...alarm} /> */}
      {/*     ))} */}
      {/*   </ul> */}
      {/* )} */}
    </li>
  );
}
