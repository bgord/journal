import { useFetcher } from "react-router";
import { signOut } from "../auth";

// TODO: translations
export function LogoutButton() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/logout" data-ml="auto" data-mr="24">
      <button
        type="submit"
        className="c-button"
        data-variant="secondary"
        disabled={fetcher.state === "submitting"}
        onClick={() => signOut({})}
      >
        {fetcher.state === "submitting" ? "Logging out…" : "Logout"}
      </button>
    </fetcher.Form>
  );
}
