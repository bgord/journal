import { useTranslations, WeakETag } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { ShareableLinkSnapshot } from "../api";
import { profileRoute } from "../router";
import { useMutation } from "../sections/use-mutation";

export function ProfileShareableLinkRevoke(props: ShareableLinkSnapshot) {
  const t = useTranslations();
  const router = useRouter();

  const mutation = useMutation({
    perform: () =>
      fetch(`/api/publishing/link/${props.id}/revoke`, {
        method: "POST",
        credentials: "include",
        headers: WeakETag.fromRevision(props.revision),
        body: JSON.stringify({}),
      }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true }),
  });

  return (
    <form onSubmit={mutation.handleSubmit} aria-busy={mutation.isLoading}>
      <button type="submit" className="c-button" data-variant="secondary" disabled={mutation.isLoading}>
        {t("profile.shareable_links.revoke.cta")}
      </button>
    </form>
  );
}
