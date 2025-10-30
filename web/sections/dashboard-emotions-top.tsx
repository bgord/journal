import { useTranslations } from "@bgord/ui";
import type { DashboardDataType } from "../api";

export function DashboardEmotionsTop(
  props: React.JSX.IntrinsicElements["div"] & {
    label: string;
    emotions: DashboardDataType["entries"]["top"]["emotions"]["today"];
  },
) {
  const t = useTranslations();

  return (
    <div data-stack="y" data-cross="center" data-fs="sm">
      <div data-color="neutral-500" data-transform="center">
        {props.label}
      </div>

      <ul data-stack="y" data-mt="3" data-gap="2">
        {props.emotions.map((stat, index) => (
          <li key={`top-emotions-all-${stat}-${index}`} data-stack="x" data-gap="2">
            <div className="c-badge" data-variant="primary">
              {stat.hits}
            </div>
            <div data-fs="xs">{t(`entry.emotion.label.value.${stat.emotionLabel}`)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
