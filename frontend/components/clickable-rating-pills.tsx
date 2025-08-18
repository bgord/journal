import type * as UI from "@bgord/ui";
import type { types } from "../../app/services/add-entry-form";

type ClickableRatingPillsProps = { total?: number } & UI.useFieldReturnType<types.EmotionIntensityType>;

export function ClickableRatingPills(props: ClickableRatingPillsProps) {
  const { value, total = 5 } = props;

  const handleClick = (rating: number) => props.set(rating);

  return (
    <div data-stack="x" data-gap="2" data-cross="center">
      {Array.from({ length: total }).map((_, index) => {
        const rating = index + 1;
        const filled = value !== null && rating <= value;

        return (
          <button
            data-disp="block"
            data-p="0"
            data-cursor="pointer"
            data-bc={filled ? undefined : "brand-600"}
            data-bw="hairline"
            data-bg={filled ? "brand-600" : undefined}
            type="button"
            key={index}
            onClick={() => handleClick(rating)}
            data-size="sm"
            data-testid={`rating-${rating}`}
          />
        );
      })}
    </div>
  );
}
