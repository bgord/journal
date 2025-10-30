import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";

export function EntryAlarms(props: EntrySnapshotWithAlarmsFormatted) {
  const t = UI.useTranslations();

  return (
    <ul data-stack="y" data-gap="5">
      {props.alarms.map((alarm) => (
        <li key={alarm.id} data-stack="y" data-gap="2" data-mt="3">
          <div data-stack="x" data-cross="center" data-gap="2" data-fs="sm" data-color="neutral-300">
            <Icons.Alarm data-size="sm" data-color="danger-200" />
            {t(`alarm.name.${alarm.name}`)} alarm for
            <div className="c-badge">{t(`entry.emotion.label.value.${alarm.emotionLabel}`)}</div>
          </div>

          <div data-stack="x" data-cross="center" data-gap="2" data-fs="sm" data-color="brand-100">
            <Icons.Sparks data-size="sm" />
            {alarm.advice}
          </div>
        </li>
      ))}
    </ul>
  );
}
