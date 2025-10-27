import * as UI from "@bgord/ui";
import { Timer } from "iconoir-react";
import { EntryReactionDescription } from "../components/entry-reaction-description";
import { EntrySituationDescription } from "../components/entry-situation-description";
import { EntrySituationKind } from "../components/entry-situation-kind";
import { EntryStartedAt } from "../components/entry-started-at";
import { RatingPills } from "../components/rating-pills";
import type { EntryType } from "../entry.api";
import { EntryAlarms } from "../sections/entry-alarms";

export function SharedEntry(props: EntryType) {
  const t = UI.useTranslations();

  return (
    <li
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
        data-main="between"
        data-cross="center"
        data-mt="2"
        {...UI.Rhythm().times(3).style.height}
      >
        {props.origin === "time_capsule" && <Timer data-size="sm" data-color="neutral-300" />}

        <EntryStartedAt startedAt={props.startedAt} />
      </header>

      <section data-stack="y" data-gap="5" data-py="5" data-bcb="neutral-700" data-bwb="hairline">
        <div data-stack="x" data-cross="center" data-gap="4">
          <div data-fs="sm" data-color="neutral-400">
            {t("entry.situation.description.label")}
          </div>

          <EntrySituationKind situationKind={props.situationKind} />
        </div>

        <EntrySituationDescription situationDescription={props.situationDescription} />

        <div data-stack="x" data-cross="center" data-gap="5" data-mt="2">
          <div className="c-badge" data-variant="primary">
            {t(`entry.emotion.label.value.${props.emotionLabel}`)}
          </div>

          <RatingPills rating={props.emotionIntensity as number} total={5} />
        </div>
      </section>

      <div data-color="neutral-400" data-fs="sm" data-mr="auto">
        {t("entry.reaction.description.label")}
      </div>

      <EntryReactionDescription reactionDescription={props.reactionDescription} />

      {props.alarms[0] && <EntryAlarms {...props} />}
    </li>
  );
}
