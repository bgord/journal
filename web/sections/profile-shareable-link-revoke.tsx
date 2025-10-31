import { useTranslations, WeakETag } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { ShareableLinkSnapshot } from "../api";
import { profileRoute } from "../router";
import { RequestState } from "../ui";

export function ProfileShareableLinkRevoke(props: ShareableLinkSnapshot) {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = useState<RequestState>(RequestState.idle);

  async function revokeShareableLink(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/publishing/link/${props.id}/revoke`, {
      method: "POST",
      credentials: "include",
      headers: WeakETag.fromRevision(props.revision),
      body: JSON.stringify({}),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true });
  }

  return (
    <form onSubmit={revokeShareableLink} aria-busy={state === RequestState.loading}>
      <button
        type="submit"
        className="c-button"
        data-variant="secondary"
        disabled={state === RequestState.loading}
      >
        {t("profile.shareable_links.revoke.cta")}
      </button>
    </form>
  );
}
