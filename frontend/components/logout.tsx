import { useFetcher, useNavigate } from "react-router";
import { signOut, useSession } from "../auth";

export function Logout() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const session = useSession();

  if (!session.data) return null;

  return (
    <fetcher.Form method="post" action="/logout">
      <button
        type="submit"
        className="c-button"
        data-variant="secondary"
        onClick={async () => await signOut({ fetchOptions: { onSuccess: () => navigate("/login") } })}
        disabled={fetcher.state === "submitting"}
      >
        {fetcher.state === "submitting" ? "Logging out…" : "Logout"}
      </button>
    </fetcher.Form>
  );
}
