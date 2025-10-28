import * as UI from "@bgord/ui";
import { Timer } from "iconoir-react";
import { Form } from "../../app/services/home-entry-add-form";
import { DescriptionLabel } from "../components/description-label";
import { EntryEmotionLabel } from "../components/entry-emotion-label";
import { EntryReactionDescription } from "../components/entry-reaction-description";
import { EntryReactionType } from "../components/entry-reaction-type";
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
      data-stack="y"
      data-gap="3"
      data-py="3"
      data-px="4"
      data-bg="neutral-900"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
    >
      <header data-stack="x" data-main="between" data-cross="center" {...UI.Rhythm().times(3).style.height}>
        {props.origin === "time_capsule" && <Timer data-size="sm" data-color="neutral-300" />}
        <EntryStartedAt startedAt={props.startedAt} />
      </header>

      <section data-stack="y" data-gap="5" data-py="2" data-pb="5" data-bcb="neutral-700" data-bwb="hairline">
        <div data-stack="x" data-cross="center" data-gap="4">
          <DescriptionLabel>{t("entry.situation.description.label")}</DescriptionLabel>
          <EntrySituationKind situationKind={props.situationKind} />
        </div>

        <EntrySituationDescription situationDescription={props.situationDescription} />

        <div data-stack="x" data-cross="center" data-gap="5" data-mt="2">
          <EntryEmotionLabel emotionLabel={props.emotionLabel} />
          <RatingPills rating={props.emotionIntensity as number} total={Form.emotionIntensity.pattern.max} />
        </div>
      </section>

      <section data-stack="y" data-gap="5">
        <div data-stack="x" data-gap="5">
          <DescriptionLabel data-mr="auto">{t("entry.reaction.description.label")}</DescriptionLabel>

          <EntryReactionType reactionType={props.reactionType} />
          <RatingPills
            rating={props.reactionEffectiveness as number}
            total={Form.reactionEffectiveness.pattern.max}
          />
        </div>
        <EntryReactionDescription reactionDescription={props.reactionDescription} />
      </section>

      {props.alarms[0] && <EntryAlarms {...props} />}
    </li>
  );
}
