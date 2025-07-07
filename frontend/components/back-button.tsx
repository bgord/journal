export function BackButton(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button {...props} type="button" className="c-button" data-variant="bare">
      Back
    </button>
  );
}
