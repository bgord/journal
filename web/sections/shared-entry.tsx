import { Rhythm, useTranslations } from "@bgord/ui";
import { Timer } from "iconoir-react";
import { Form } from "../../app/services/home-entry-add-form";
import type { EntrySnapshotFormatted } from "../api";
import {
  DescriptionLabel,
  EntryEmotionLabel,
  EntryReactionDescription,
  EntryReactionType,
  EntrySituationDescription,
  EntrySituationKind,
  EntryStartedAt,
  RatingPills,
} from "../components";
import { EntryAlarms } from "../sections/entry-alarms";

export function SharedEntry(props: EntrySnapshotFormatted) {
  const t = useTranslations();

  return (
    <li
      data-bg="neutral-900"
      data-br="xs"
      data-gap="3"
      data-pb="5"
      data-pt="3"
      data-px="4"
      data-shadow="sm"
      data-stack="y"
    >
      <header data-cross="center" data-main="between" data-stack="x" {...Rhythm().times(3).style.height}>
        {props.origin === "time_capsule" && <Timer data-color="neutral-300" data-size="sm" />}
        <EntryStartedAt startedAt={props.startedAt} />
      </header>

      <section data-gap="5" data-pb="5" data-py="2" data-stack="y">
        <div data-cross="center" data-gap="4" data-stack="x">
          <DescriptionLabel>{t("entry.situation.description.label")}</DescriptionLabel>
          <EntrySituationKind situationKind={props.situationKind} />
        </div>

        <EntrySituationDescription situationDescription={props.situationDescription} />

        <div data-cross="center" data-gap="5" data-mt="2" data-stack="x">
          <EntryEmotionLabel emotionLabel={props.emotionLabel} />
          <RatingPills rating={props.emotionIntensity as number} total={Form.emotionIntensity.pattern.max} />
        </div>
      </section>

      <section data-gap="5" data-stack="y">
        <div data-gap="5" data-mt="2" data-stack="x">
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
