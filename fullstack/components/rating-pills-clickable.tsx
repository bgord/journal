import type { useFieldReturnType } from "@bgord/ui";
import type { types } from "../../app/services/home-entry-add-form";

type ClickableRatingPillsProps = { total?: number } & useFieldReturnType<types.EmotionIntensityType>;

export function RatingPillsClickable(props: ClickableRatingPillsProps) {
  const { value, total = 5 } = props;

  const handleClick = (rating: number) => props.set(rating);

  return (
    <div data-stack="x" data-gap="2" data-cross="center">
      {Array.from({ length: total }).map((_, index) => {
        const rating = index + 1;
        const filled = value !== null && rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            data-disp="block"
            data-p="0"
            data-cursor="pointer"
            data-bc={filled ? undefined : "brand-600"}
            data-bw="hairline"
            data-bg={filled ? "brand-600" : undefined}
            data-size="sm"
            data-testid={`rating-${rating}`}
            data-rating-pill="" // ← add this hook
            aria-label={`${rating} of ${total}`} // ← no visual change, better SR text
          />
        );
      })}
    </div>
  );
}
