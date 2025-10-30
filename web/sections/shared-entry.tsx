import * as bg from "@bgord/ui";
import { Timer } from "iconoir-react";
import { Form } from "../../app/services/home-entry-add-form";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";
import * as UI from "../components";
import { EntryAlarms } from "../sections/entry-alarms";

export function SharedEntry(props: EntrySnapshotWithAlarmsFormatted) {
  const t = bg.useTranslations();

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
      <header data-stack="x" data-main="between" data-cross="center" {...bg.Rhythm().times(3).style.height}>
        {props.origin === "time_capsule" && <Timer data-size="sm" data-color="neutral-300" />}
        <UI.EntryStartedAt startedAt={props.startedAt} />
      </header>

      <section data-stack="y" data-gap="5" data-py="2" data-pb="5" data-bcb="neutral-700" data-bwb="hairline">
        <div data-stack="x" data-cross="center" data-gap="4">
          <UI.DescriptionLabel>{t("entry.situation.description.label")}</UI.DescriptionLabel>
          <UI.EntrySituationKind situationKind={props.situationKind} />
        </div>

        <UI.EntrySituationDescription situationDescription={props.situationDescription} />

        <div data-stack="x" data-cross="center" data-gap="5" data-mt="2">
          <UI.EntryEmotionLabel emotionLabel={props.emotionLabel} />
          <UI.RatingPills
            rating={props.emotionIntensity as number}
            total={Form.emotionIntensity.pattern.max}
          />
        </div>
      </section>

      <section data-stack="y" data-gap="5">
        <div data-stack="x" data-gap="5">
          <UI.DescriptionLabel data-mr="auto">{t("entry.reaction.description.label")}</UI.DescriptionLabel>

          <UI.EntryReactionType reactionType={props.reactionType} />
          <UI.RatingPills
            rating={props.reactionEffectiveness as number}
            total={Form.reactionEffectiveness.pattern.max}
          />
        </div>
        <UI.EntryReactionDescription reactionDescription={props.reactionDescription} />
      </section>

      {props.alarms[0] && <EntryAlarms {...props} />}
    </li>
  );
}
