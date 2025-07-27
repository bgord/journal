import * as RR from "react-router";

export function Logo() {
  return (
    <div className="logo" data-fs="4xl" data-fw="bold" data-ls="wider" data-color="brand-600">
      <RR.Link to="/">JOURNAL</RR.Link>
    </div>
  );
}
