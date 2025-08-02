import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import type { EntryType } from "../app/routes/home";

export function Alarm(props: EntryType["alarms"][number]) {
  const t = UI.useTranslations();

  return (
    <li key={props.id} data-stack="y" data-gap="2" data-mt="3">
      <div data-stack="x" data-cross="center" data-gap="2" data-fs="sm" data-color="neutral-300">
        <Icons.Alarm data-size="sm" data-color="danger-200" />
        {t(`alarm.name.${props.name}`)} alarm for
        <div className="c-badge">{t(`entry.emotion.label.value.${props.emotionLabel}`)}</div>
      </div>

      <div data-stack="x" data-cross="center" data-gap="2" data-fs="sm" data-color="brand-100">
        <Icons.Sparks data-size="sm" />
        {props.advice}
      </div>
    </li>
  );
}
