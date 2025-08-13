type RatingPillsProps = { rating: number; total: number };

export function RatingPills(props: RatingPillsProps) {
  const size = 16;
  const gap = 4;

  const width = props.total * size + (props.total - 1) * gap;

  return (
    <svg width={width} height={size} viewBox={`0 0 ${width} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: props.total }).map((_, index) => {
        const x = index * (size + gap);
        const filled = index < props.rating;

        return (
          <rect
            key={index}
            x={x}
            y={0}
            width={size}
            height={size}
            rx="2"
            fill={filled ? "var(--color-brand-500)" : "none"}
            stroke={filled ? "none" : "var(--color-brand-200)"}
          />
        );
      })}
    </svg>
  );
}
