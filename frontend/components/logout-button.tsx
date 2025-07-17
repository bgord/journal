import { useFetcher, useNavigate } from "react-router";
import { signOut } from "../auth";

// TODO: translations
export function LogoutButton() {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  return (
    <fetcher.Form method="post" action="/logout" data-mr="24">
      <button
        type="submit"
        className="c-button"
        data-variant="secondary"
        disabled={fetcher.state === "submitting"}
        onClick={() => signOut({ fetchOptions: { onSuccess: () => navigate("/") } })}
      >
        {fetcher.state === "submitting" ? "Logging out…" : "Logout"}
      </button>
    </fetcher.Form>
  );
}
