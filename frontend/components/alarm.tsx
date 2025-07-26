import * as UI from "@bgord/ui";
import { Alarm as AlarmIcon } from "iconoir-react";
import type { EntryType } from "../app/routes/home";

export function Alarm(props: EntryType["alarms"][number]) {
  const t = UI.useTranslations();

  return (
    <li key={props.id} data-display="flex" data-gap="5">
      <div data-display="flex" data-gap="3" data-fs="sm" data-color="danger-300">
        <AlarmIcon height={20} width={20} />
        {t(`alarm.name.${props.name}`)} alarm for
        <div className="c-badge">{t(`entry.emotion.label.value.${props.emotionLabel}`)}</div>
      </div>
      <div data-fs="sm" data-color="brand-100">
        {props.advice}
      </div>
    </li>
  );
}
