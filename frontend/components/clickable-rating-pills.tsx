import * as UI from "@bgord/ui";
import type { types } from "../../app/services/add-entry-form";

type ClickableRatingPillsProps = { total?: number } & UI.useFieldReturnType<types.EmotionIntensityType>;

export function ClickableRatingPills(props: ClickableRatingPillsProps) {
  const { value, total = 5 } = props;
  const size = 16;

  const handleClick = (rating: number) => {
    props.set(rating);
  };

  return (
    <div data-display="flex" data-gap="3" data-cross="center">
      {Array.from({ length: total }).map((_, index) => {
        const rating = index + 1;
        const filled = value !== null && rating <= value;

        return (
          <button
            data-display="block"
            data-p="0"
            data-br="2"
            data-cursor="pointer"
            type="button"
            /* biome-ignore lint: lint/suspicious/noArrayIndexKey */
            key={index}
            onClick={() => handleClick(rating)}
            style={{
              border: filled ? "none" : "1px solid var(--brand-200)",
              backgroundColor: filled ? "var(--brand-500)" : "transparent",
              ...UI.Rhythm(size).times(1).square,
            }}
            data-testid={`rating-${rating}`}
          />
        );
      })}
    </div>
  );
}
