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
      data-bg="neutral-800"
      data-cross="center"
      data-fs="sm"
      data-gap="5"
      data-p="3"
      data-stack="x"
    >
      {props.status === ShareableLinkStatusEnum.active && (
        <div
          className="c-badge"
          data-bc="positive-600"
          data-bs="solid"
          data-bw="hairline"
          data-color="positive-400"
          data-variant="primary"
        >
          {t("profile.shareable_links.status.active.value")}
        </div>
      )}

      {[ShareableLinkStatusEnum.revoked, ShareableLinkStatusEnum.expired].includes(props.status) && (
        <div
          className="c-badge"
          data-bc="danger-600"
          data-bs="solid"
          data-bw="hairline"
          data-color="danger-400"
          data-variant="outline"
        >
          {t(`profile.shareable_links.status.${props.status}.value`)}
        </div>
      )}

      <div data-gap="2" data-stack="y">
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

      <div data-gap="3" data-md-ml="0" data-ml="auto" data-stack="y">
        {props.status === ShareableLinkStatusEnum.active && (
          <div data-color="neutral-400" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
            <Clock data-size="xs" />
            {t("profile.shareable_links.expires_at", { date: props.expiresAt })}
          </div>
        )}

        {props.status === ShareableLinkStatusEnum.revoked && (
          <div data-color="neutral-400" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
            <Clock data-size="xs" />
            {t("profile.shareable_links.revoked_at", { date: props.updatedAt })}
          </div>
        )}

        {props.status === ShareableLinkStatusEnum.expired && (
          <div data-color="neutral-400" data-fs="xs">
            {t("profile.shareable_links.expired_at", { date: props.expiresAt })}
          </div>
        )}

        {props.status === ShareableLinkStatusEnum.active && (
          <div data-gap="3" data-stack="x">
            <Link
              params={{ shareableLinkId: props.id }}
              target="_blank"
              to="/shared-entries/$shareableLinkId"
            >
              <button className="c-button" data-variant="with-icon" type="button">
                <OpenInWindow data-size="md" />
              </button>
            </Link>

            <ButtonCopy text={copyURL(props.id)} />

            <ProfileShareableLinkRevoke {...props} />
          </div>
        )}

        {[ShareableLinkStatusEnum.revoked, ShareableLinkStatusEnum.expired].includes(props.status) && (
          <div data-gap="3" data-stack="x">
            <button
              className="c-button"
              data-variant="secondary"
              disabled={mutation.isLoading}
              onClick={exit.trigger}
              title={t("profile.shareable_links.hide.cta")}
              type="submit"
            >
              {t("profile.shareable_links.hide.cta")}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
