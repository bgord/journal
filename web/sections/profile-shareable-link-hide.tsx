import { useMutation, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ShareableLinkStatusEnum } from "../../app/services/create-shareable-link-form";
import type { ShareableLinkSnapshot } from "../api";
import { profileRoute } from "../router";

export function ProfileShareableLinkHide(props: ShareableLinkSnapshot) {
  const t = useTranslations();
  const router = useRouter();

  const mutation = useMutation({
    perform: () => fetch(`/api/publishing/link/${props.id}/hide`, { method: "POST", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true }),
  });

  if (![ShareableLinkStatusEnum.revoked, ShareableLinkStatusEnum.expired].includes(props.status)) return null;

  return (
    <div data-stack="x" data-gap="3" data-ml="auto">
      <form onSubmit={mutation.handleSubmit} aria-busy={mutation.isLoading}>
        <button
          type="submit"
          className="c-button"
          data-variant="secondary"
          disabled={mutation.isLoading}
          title={t("profile.shareable_links.hide.cta")}
        >
          {t("profile.shareable_links.hide.cta")}
        </button>
      </form>
    </div>
  );
}
