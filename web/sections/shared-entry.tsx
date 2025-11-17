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
      data-stack="y"
      data-gap="3"
      data-px="4"
      data-pt="3"
      data-pb="5"
      data-bg="neutral-900"
      data-fs="base"
      data-br="xs"
      data-shadow="sm"
    >
      <header data-stack="x" data-main="between" data-cross="center" {...Rhythm().times(3).style.height}>
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
        <div data-stack="x" data-gap="5" data-mt="2">
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
