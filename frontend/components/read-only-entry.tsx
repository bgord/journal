import * as UI from "@bgord/ui";
import type { EntryType } from "../app/routes/home";
import { Alarm } from "./alarm";
import { RatingPills } from "./rating-pills";

export function ReadOnlyEntry(props: EntryType) {
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
        <div data-fs="base" data-fw="regular" data-color="neutral-300">
          {props.startedAt}
        </div>
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

        <div data-stack="x" data-cross="center" data-gap="5" data-mt="2">
          <div className="c-badge" data-variant="primary">
            {t(`entry.emotion.label.value.${props.emotionLabel}`)}
          </div>

          <RatingPills rating={props.emotionIntensity as number} total={5} />
        </div>
      </section>

      <div data-stack="x" data-main="between" data-cross="center" data-py="5" data-color="neutral-200">
        {props.reactionDescription}
      </div>

      {props.alarms[0] && (
        <ul data-stack="y" data-gap="5" data-mb="5">
          {props.alarms.map((alarm) => (
            <Alarm key={alarm.id} {...alarm} />
          ))}
        </ul>
      )}
    </li>
  );
}
