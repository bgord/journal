import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import type { EntryType } from "../app/routes/home";

export function Alarm(props: EntryType["alarms"][number]) {
  const t = UI.useTranslations();

  return (
    <li key={props.id} data-disp="flex" data-gap="4" data-mt="3">
      <div data-disp="flex" data-gap="1" data-fs="sm" data-color="neutral-300">
        <Icons.Alarm data-size="md" data-color="danger-200" />
        {t(`alarm.name.${props.name}`)} alarm for
        <div className="c-badge">{t(`entry.emotion.label.value.${props.emotionLabel}`)}</div>
      </div>

      <div data-fs="sm" data-color="brand-100" data-ml="8">
        {props.advice}
      </div>
    </li>
  );
}
