import * as UI from "@bgord/ui";
import { Alarm as AlarmIcon } from "iconoir-react";
import type { SelectEntriesFull } from "../../infra/schema";

export function Alarm(props: SelectEntriesFull["alarms"][number]) {
  const t = UI.useTranslations();

  return (
    <li key={props.id} data-display="flex" data-gap="6">
      <div data-display="flex" data-gap="6">
        <AlarmIcon height={20} width={20} data-color="red-500" />
        {t(`alarm.name.${props.name}`)} for
        <div className="c-badge">{t(`entry.emotion.label.value.${props.emotionLabel}`)}</div>
      </div>
      <div data-fs="14" {...UI.Colorful("brand-500").style.color}>
        {props.advice}
      </div>
    </li>
  );
}
