export function Select(props: React.JSX.IntrinsicElements["select"]) {
  return (
    <div className="c-select-wrapper">
      <select className="c-select" {...props} />
    </div>
  );
}
