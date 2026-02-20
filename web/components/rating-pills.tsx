type RatingPillsProps = { rating: number; total: number };

export function RatingPills(props: RatingPillsProps) {
  const size = 16;
  const gap = 4;

  const width = props.total * size + (props.total - 1) * gap;

  return (
    <svg height={size} viewBox={`0 0 ${width} ${size}`} width={width} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: props.total }).map((_, index) => {
        const x = index * (size + gap);
        const filled = index < props.rating;

        return (
          <rect
            data-focus-ring="neutral"
            fill={filled ? "var(--color-brand-600)" : "none"}
            height={size}
            key={index}
            rx="2"
            stroke={filled ? "none" : "var(--color-brand-600)"}
            width={size}
            x={x}
            y={0}
          />
        );
      })}
    </svg>
  );
}
