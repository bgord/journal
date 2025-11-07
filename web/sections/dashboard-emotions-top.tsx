import { useTranslations } from "@bgord/ui";
import type { DashboardDataType } from "../api";
import { DashboardCellEmpty } from "../components";

export function DashboardEmotionsTop(
  props: React.JSX.IntrinsicElements["div"] & {
    label: string;
    emotions: DashboardDataType["entries"]["top"]["emotions"]["today"];
  },
) {
  const t = useTranslations();

  return (
    <div data-stack="y" data-gap="5" data-cross="center" data-fs="sm">
      <div data-color="neutral-500" data-transform="center">
        {props.label}
      </div>

      {!props.emotions[0] && <DashboardCellEmpty />}

      {props.emotions[0] && (
        <ul data-stack="y" data-gap="3">
          {props.emotions.map((stat, index) => (
            <li key={`top-emotions-all-${stat}-${index}`} data-stack="x" data-gap="3">
              <div className="c-badge" data-variant="primary">
                {stat.hits}
              </div>
              <div data-fs="xs">{t(`entry.emotion.label.value.${stat.emotionLabel}`)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
