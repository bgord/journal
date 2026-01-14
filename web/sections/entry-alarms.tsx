import { useTranslations } from "@bgord/ui";
import { Alarm } from "iconoir-react";
import type { EntrySnapshotFormatted } from "../api";
import { Advice } from "../components";

export function EntryAlarms(props: EntrySnapshotFormatted) {
  const t = useTranslations();

  return (
    <ul data-stack="y" data-gap="4" data-mt="4">
      {props.alarms.map((alarm) => (
        <li key={alarm.id} data-stack="y" data-gap="1" data-fs="sm">
          <div data-stack="x" data-gap="2" data-cross="center" data-color="neutral-300">
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
