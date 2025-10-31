import { useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ShareableLinkStatusEnum } from "../../app/services/create-shareable-link-form";
import type { ShareableLinkSnapshot } from "../api";
import { profileRoute } from "../router";
import { RequestState } from "../ui";

export function ProfileShareableLinkHide(props: ShareableLinkSnapshot) {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = useState<RequestState>(RequestState.idle);

  if (![ShareableLinkStatusEnum.revoked, ShareableLinkStatusEnum.expired].includes(props.status)) {
    return null;
  }

  async function hideShareableLink(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/publishing/link/${props.id}/hide`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true });
  }

  return (
    <div data-stack="x" data-gap="3" data-ml="auto">
      <form onSubmit={hideShareableLink} aria-busy={state === RequestState.loading}>
        <button
          type="submit"
          className="c-button"
          data-variant="secondary"
          disabled={state === RequestState.loading}
          title={t("profile.shareable_links.hide.cta")}
        >
          {t("profile.shareable_links.hide.cta")}
        </button>
      </form>
    </div>
  );
}
