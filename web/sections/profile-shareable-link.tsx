import { useExitAction, useMutation, usePluralize, useTranslations } from "@bgord/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { Clock, OpenInWindow } from "iconoir-react";
import { ShareableLinkStatusEnum } from "../../app/services/create-shareable-link-form";
import type { ShareableLinkSnapshot } from "../api";
import { ButtonCopy } from "../components";
import { profileRoute } from "../router";
import { ProfileShareableLinkRevoke } from "./profile-shareable-link-revoke";

export function ProfileShareableLink(props: ShareableLinkSnapshot) {
  const t = useTranslations();
  const pluralize = usePluralize();
  const router = useRouter();

  const copyURL = (id: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/shared-entries/${id}`;
  };

  const mutation = useMutation({
    perform: () => fetch(`/api/publishing/link/${props.id}/hide`, { method: "POST", credentials: "include" }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === profileRoute.id, sync: true }),
  });

  const exit = useExitAction({ action: mutation.mutate, animation: "shrink-fade-out" });

  if (!exit.visible) return null;

  return (
    // @ts-expect-error
    <li
      {...exit.attach}
      data-stack="x"
      data-cross="center"
      data-gap="5"
      data-p="3"
      data-fs="sm"
      data-bg="neutral-800"
    >
      {props.status === ShareableLinkStatusEnum.active && (
        <div className="c-badge" data-variant="primary" data-bc="positive-600" data-color="positive-400">
          {t("profile.shareable_links.status.active.value")}
        </div>
      )}

      {[ShareableLinkStatusEnum.revoked, ShareableLinkStatusEnum.expired].includes(props.status) && (
        <div className="c-badge" data-variant="outline" data-bc="danger-600" data-color="danger-400">
          {t(`profile.shareable_links.status.${props.status}.value`)}
        </div>
      )}

      <div data-stack="y" data-gap="2">
        <div>{t(`profile.shareable_links.specification.${props.publicationSpecification}.value`)}</div>

        <div data-color="neutral-300">
          {props.dateRangeStart} - {props.dateRangeEnd}
        </div>

        {!(props.hits && props.uniqueVisitors) && (
          <div data-color="neutral-500" data-fs="xs">
            {t("profile.shareable_links.no_hits")}
          </div>
        )}

        {props.hits > 0 && props.uniqueVisitors > 0 && (
          <div data-color="neutral-500" data-fs="xs">
            {t("profile.shareable_links.hits", {
              totalHits: props.hits,
              hits: pluralize({
                value: props.hits,
                singular: t("app.hit.singular"),
                plural: t("app.hit.plural"),
                genitive: t("app.hit.genitive"),
              }),
              visitors: pluralize({
                value: props.uniqueVisitors,
                singular: t("app.visitor.singular"),
                plural: t("app.visitor.plural"),
                genitive: t("app.visitor.genitive"),
              }),
              uniqueVisitors: props.uniqueVisitors,
            })}
          </div>
        )}
      </div>

      <div data-stack="y" data-gap="3" data-ml="auto">
        {props.status === ShareableLinkStatusEnum.active && (
          <div data-stack="x" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-400">
            <Clock data-size="xs" />
            {t("profile.shareable_links.expires_at", { date: props.expiresAt })}
          </div>
        )}

        {props.status === ShareableLinkStatusEnum.revoked && (
          <div data-stack="x" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-400">
            <Clock data-size="xs" />
            {t("profile.shareable_links.revoked_at", { date: props.updatedAt })}
          </div>
        )}

        {props.status === ShareableLinkStatusEnum.expired && (
          <div data-fs="xs" data-color="neutral-400">
            {t("profile.shareable_links.expired_at", { date: props.expiresAt })}
          </div>
        )}

        {props.status === ShareableLinkStatusEnum.active && (
          <div data-stack="x" data-gap="3" data-ml="auto">
            <Link
              to="/shared-entries/$shareableLinkId"
              params={{ shareableLinkId: props.id }}
              target="_blank"
            >
              <button type="button" className="c-button" data-variant="with-icon">
                <OpenInWindow data-size="md" />
              </button>
            </Link>

            <ButtonCopy text={copyURL(props.id)} />

            <ProfileShareableLinkRevoke {...props} />
          </div>
        )}

        {[ShareableLinkStatusEnum.revoked, ShareableLinkStatusEnum.expired].includes(props.status) && (
          <div data-stack="x" data-gap="3" data-ml="auto">
            <button
              type="submit"
              className="c-button"
              data-variant="secondary"
              disabled={mutation.isLoading}
              title={t("profile.shareable_links.hide.cta")}
              onClick={exit.trigger}
            >
              {t("profile.shareable_links.hide.cta")}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
