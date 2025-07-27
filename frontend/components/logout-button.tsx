import * as UI from "@bgord/ui";
import { useFetcher, useNavigate } from "react-router";
import { signOut } from "../auth";

export function LogoutButton() {
  const t = UI.useTranslations();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  return (
    <fetcher.Form method="post" action="/logout">
      <button
        type="submit"
        className="c-button"
        data-variant="bare"
        disabled={fetcher.state === "submitting"}
        onClick={() => signOut({ fetchOptions: { onSuccess: () => navigate("/") } })}
      >
        {fetcher.state === "submitting" ? t("auth.logout.in_progress") : t("auth.logout.cta")}
      </button>
    </fetcher.Form>
  );
}
