import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Clock, OpenInWindow, ShareIos } from "iconoir-react";
import { ButtonCopy } from "../components";
import { profileRoute } from "../router";
import { ProfileShareableLinkCreate } from "./profile-shareable-link-create";

export function ProfileShareableLinks() {
  const t = useTranslations();
  const { shareableLinks } = profileRoute.useLoaderData();

  const copyURL = (id: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/shared-entries/${id}`;
  };

  return (
    <div data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <ShareIos data-size="md" />
        <div>{t("profile.shareable_links.header")}</div>
        <ProfileShareableLinkCreate />
      </div>

      <ul data-stack="y" data-gap="5">
        {shareableLinks.map((link) => (
          <li
            key={link.id}
            data-stack="x"
            data-cross="center"
            data-gap="5"
            data-p="3"
            data-fs="sm"
            data-bg="neutral-800"
          >
            {link.status === "active" && (
              <div
                className="c-badge"
                data-variant="primary"
                data-bc="positive-600"
                data-color="positive-400"
              >
                {t("profile.shareable_links.status.active.value")}
              </div>
            )}

            {["revoked", "expired"].includes(link.status) && (
              <div className="c-badge" data-variant="outline" data-bc="danger-600" data-color="danger-400">
                {t(`profile.shareable_links.status.${link.status}.value`)}
              </div>
            )}

            <div data-stack="y" data-gap="2">
              <div>{t(`profile.shareable_links.specification.${link.publicationSpecification}.value`)}</div>

              <div data-color="neutral-300">
                {link.dateRangeStart} - {link.dateRangeEnd}
              </div>

              {/* {!(link.totalHits && link.uniqueVisitors) && ( */}
              {/*   <div data-color="neutral-500">{t("profile.shareable_links.no_hits")}</div> */}
              {/* )} */}

              {/* {link.totalHits > 0 && link.uniqueVisitors > 0 && ( */}
              {/*   <div data-color="neutral-500"> */}
              {/*     {t("profile.shareable_links.hits", { */}
              {/*       totalHits: link.totalHits, */}
              {/*       hits: pluralize({ */}
              {/*         value: link.totalHits, */}
              {/*         singular: t("app.hit.singular"), */}
              {/*         plural: t("app.hit.plural"), */}
              {/*         genitive: t("app.hit.genitive"), */}
              {/*       }), */}
              {/*       visitors: pluralize({ */}
              {/*         value: link.uniqueVisitors, */}
              {/*         singular: t("app.visitor.singular"), */}
              {/*         plural: t("app.visitor.plural"), */}
              {/*         genitive: t("app.visitor.genitive"), */}
              {/*       }), */}
              {/*       uniqueVisitors: link.uniqueVisitors, */}
              {/*     })} */}
              {/*   </div> */}
              {/* )} */}
            </div>

            <div data-stack="y" data-gap="3" data-ml="auto">
              {link.status === "active" && (
                <div data-stack="x" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-400">
                  <Clock data-size="xs" />
                  {t("profile.shareable_links.expires_at", { date: link.expiresAt })}
                </div>
              )}

              {link.status === "revoked" && (
                <div data-stack="x" data-cross="center" data-gap="1" data-fs="xs" data-color="neutral-400">
                  <Clock data-size="xs" />
                  {t("profile.shareable_links.revoked_at", { date: link.updatedAt })}
                </div>
              )}

              {link.status === "expired" && (
                <div data-fs="xs" data-color="neutral-400">
                  {t("profile.shareable_links.expired_at", { date: link.expiresAt })}
                </div>
              )}

              {link.status === "active" && (
                <div data-stack="x" data-gap="3" data-ml="auto">
                  <Link
                    to="/shared-entries/$shareableLinkId"
                    params={{ shareableLinkId: link.id }}
                    target="_blank"
                  >
                    <button type="button" className="c-button" data-variant="with-icon">
                      <OpenInWindow data-size="md" />
                    </button>
                  </Link>

                  <ButtonCopy text={copyURL(link.id)} />

                  <form method="POST" action=".">
                    <input name="id" type="hidden" value={link.id} />
                    <input name="revision" type="hidden" value={link.revision} />
                    <input name="intent" type="hidden" value="shareable_link_revoke" />
                    <button type="submit" className="c-button" data-variant="secondary">
                      {t("profile.shareable_links.revoke.cta")}
                    </button>
                  </form>
                </div>
              )}

              {["revoked", "expired"].includes(link.status) && (
                <div data-stack="x" data-gap="3">
                  <form method="POST" action=".">
                    <input name="shareableLinkId" type="hidden" value={link.id} />
                    <input name="intent" type="hidden" value="shareable_link_hide" />
                    <button type="submit" className="c-button" data-variant="secondary">
                      {t("profile.shareable_links.hide.cta")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
