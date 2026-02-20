import { useTranslations } from "@bgord/ui";
import { Alarm } from "iconoir-react";
import type { EntrySnapshotFormatted } from "../api";
import { Advice } from "../components";

export function EntryAlarms(props: EntrySnapshotFormatted) {
  const t = useTranslations();

  return (
    <ul data-gap="4" data-mt="4" data-stack="y">
      {props.alarms.map((alarm) => (
        <li data-fs="sm" data-gap="1" data-stack="y" key={alarm.id}>
          <div data-color="neutral-300" data-cross="center" data-gap="2" data-stack="x">
            <Alarm data-color="danger-200" data-size="sm" />
            {t(`alarm.name.${alarm.name}`)} alarm for
            <div className="c-badge">{t(`entry.emotion.label.value.${alarm.emotionLabel}`)}</div>
          </div>

          <Advice data-color="brand-100">{alarm.advice}</Advice>
        </li>
      ))}
    </ul>
  );
}
