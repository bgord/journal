import { useTranslations } from "@bgord/ui";
import { Alarm } from "iconoir-react";
import type { EntrySnapshotWithAlarmsFormatted } from "../api";
import { Advice } from "../components";

export function EntryAlarms(props: EntrySnapshotWithAlarmsFormatted) {
  const t = useTranslations();

  return (
    <ul data-stack="y" data-gap="5">
      {props.alarms.map((alarm) => (
        <li key={alarm.id} data-stack="y" data-gap="2" data-mt="3" data-fs="sm">
          <div data-stack="x" data-cross="center" data-gap="2" data-color="neutral-300">
            <Alarm data-size="sm" data-color="danger-200" />
            {t(`alarm.name.${alarm.name}`)} alarm for
            <div className="c-badge">{t(`entry.emotion.label.value.${alarm.emotionLabel}`)}</div>
          </div>

          <Advice data-color="brand-100">{alarm.advice}</Advice>
        </li>
      ))}
    </ul>
  );
}
