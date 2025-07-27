import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import type { EntryType } from "../app/routes/home";

export function Alarm(props: EntryType["alarms"][number]) {
  const t = UI.useTranslations();

  return (
    <li key={props.id} data-display="flex" data-gap="4" data-mt="3">
      <div data-display="flex" data-gap="3" data-fs="sm" data-color="neutral-300">
        <Icons.Alarm data-size="md" data-color="danger-300" />
        {t(`alarm.name.${props.name}`)} alarm for
        <div className="c-badge" data-variant="primary">
          {t(`entry.emotion.label.value.${props.emotionLabel}`)}
        </div>
      </div>

      <div data-fs="sm" data-color="brand-100" data-ml="8">
        {props.advice}
      </div>
    </li>
  );
}
