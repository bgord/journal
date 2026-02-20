import type { UseNumberFieldReturnType } from "@bgord/ui";
import type { types } from "../../app/services/home-entry-add-form";

type ClickableRatingPillsProps = { total?: number } & UseNumberFieldReturnType<types.EmotionIntensityType>;

export function RatingPillsClickable(props: ClickableRatingPillsProps) {
  const { value, total = 5 } = props;

  const handleClick = (rating: number) => props.set(rating);

  return (
    <div data-cross="center" data-gap="2" data-stack="x">
      {Array.from({ length: total }).map((_, index) => {
        const rating = index + 1;
        const filled = value !== null && rating <= Number(value);

        return (
          <button
            aria-label={`${rating} of ${total}`}
            data-bc="brand-600"
            data-bg={filled ? "brand-600" : undefined}
            data-bs="solid"
            data-bw="hairline"
            data-cursor="pointer"
            data-disp="block"
            data-focus-ring="neutral"
            data-p="0"
            data-rating-pill=""
            data-size="sm"
            data-testid={`rating-${rating}`}
            key={rating}
            onClick={() => handleClick(rating)}
            type="button"
          />
        );
      })}
    </div>
  );
}
