export function Select(props: React.JSX.IntrinsicElements["select"]) {
  return (
    <div className="c-select-wrapper" data-mr="auto">
      <select className="c-select" {...props} />
    </div>
  );
}
