import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as RR from "react-router";
import { API } from "../../api";
import { guard } from "../../auth";
import * as Components from "../../components";
import { ReadModel } from "../../read-model";
import type { Route as AuthLayoutRoute } from "./+types/auth-layout";
import type { Route } from "./+types/profile";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await guard.getServerSession(request);
  const userId = session?.user.id as string;

  const shareableLinks = await ReadModel.listShareableLinks(userId);

  const aiUsageToday = await ReadModel.getAiUsageToday(userId);

  return { shareableLinks, form: ReadModel.CreateShareableLinkForm, aiUsageToday };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = UI.Cookies.extractFrom(request);
  const form = await request.formData();
  const intent = form.get("intent");

  if (intent === "shareable_link_revoke") {
    await API(`/publishing/link/${form.get("id")}/revoke`, {
      method: "POST",
      headers: { cookie, ...UI.WeakETag.fromRevision(Number(form.get("revision"))) },
    });

    return { ok: true };
  }

  if (intent === "shareable_link_hide") {
    await ReadModel.hideShareableLink(String(form.get("shareableLinkId")));
    return { ok: true };
  }

  if (intent === "shareable_link_create") {
    await API("/publishing/link/create", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form.entries())),
      headers: { cookie },
    });
    return { ok: true };
  }

  throw new Error("Intent unknown");
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const pluralize = UI.usePluralize();

  const session = RR.useOutletContext<AuthLayoutRoute.ComponentProps["loaderData"]>();

  return (
    <main
      data-stack="y"
      data-gap="12"
      data-my="8"
      data-mx="auto"
      data-p="8"
      data-width="100%"
      data-maxw="md"
      data-br="sm"
      data-color="neutral-100"
      data-bg="neutral-900"
      ata-bg="neutral-900"
    >
      <h2
        data-stack="x"
        data-gap="3"
        data-pb="5"
        data-fw="bold"
        data-fs="base"
        data-bcb="neutral-800"
        data-bwb="hairline"
      >
        <Icons.ProfileCircle data-size="md" data-color="brand-300" /> {t("profile.header")}
      </h2>

      <div data-stack="y" data-gap="5">
        <div data-stack="x" data-cross="center" data-gap="3">
          <Icons.EnergyUsageWindow data-size="md" />
          <div>{t("profile.ai_limits.header")}</div>
          <div
            data-stack="x"
            data-cross="center"
            data-gap="1"
            data-ml="auto"
            data-color="neutral-400"
            data-fs="xs"
          >
            <Icons.InfoCircle data-size="sm" />
            {t("profile.ai_limits.resets_in", { hours: loaderData.aiUsageToday.resetsIn })}
          </div>
        </div>

        <div data-stack="x" data-cross="center" data-gap="3" data-color="neutral-400">
          {!loaderData.aiUsageToday.consumed && (
            <Icons.CheckSquare data-size="md" data-color="positive-400" />
          )}
          {loaderData.aiUsageToday.consumed && <Icons.CheckSquare data-size="md" data-color="danger-400" />}
          {t("profile.ai_limits.usage", {
            count: loaderData.aiUsageToday.count,
            limit: loaderData.aiUsageToday.limit,
            noun: pluralize({
              value: loaderData.aiUsageToday.count,
              singular: t("app.prompt.singular"),
              plural: t("app.prompt.plural"),
            }),
          })}
        </div>
      </div>

      <div data-stack="y" data-gap="5">
        <div data-stack="x" data-cross="center" data-gap="3">
          <Icons.ShareIos data-size="md" />
          <div>{t("profile.shareable_links.header")}</div>
          <Components.CreateShareableLink />
        </div>

        {!loaderData.shareableLinks[0] && (
          <div data-fs="sm" data-color="neutral-400">
            {t("profile.shareable_links.empty")}
          </div>
        )}

        <ul data-stack="y" data-gap="5">
          {loaderData.shareableLinks.map((link) => (
            <li
              key={link.id}
              data-stack="x"
              data-cross="center"
              data-py="2"
              data-px="4"
              data-fs="sm"
              data-bg="neutral-800"
            >
              {link.status === "active" && (
                <div
                  className="c-badge"
                  data-variant="primary"
                  data-bc="positive-600"
                  data-color="positive-400"
                  data-mr="5"
                >
                  {t("profile.shareable_links.status.active.value")}
                </div>
              )}

              {["revoked", "expired"].includes(link.status) && (
                <div
                  className="c-badge"
                  data-variant="outline"
                  data-bc="danger-600"
                  data-color="danger-400"
                  data-mr="5"
                >
                  {t(`profile.shareable_links.status.${link.status}.value`)}
                </div>
              )}

              <div data-stack="y" data-gap="1">
                <div data-mr="2">
                  {t(`profile.shareable_links.specification.${link.publicationSpecification}.value`)}
                </div>

                <div data-color="neutral-300">
                  {link.dateRangeStart} - {link.dateRangeEnd}
                </div>

                {!(link.totalHits && link.uniqueVisitors) && (
                  <div data-color="neutral-500">{t("profile.shareable_links.no_hits")}</div>
                )}

                {link.totalHits > 0 && link.uniqueVisitors > 0 && (
                  <div data-color="neutral-500">
                    {t("profile.shareable_links.hits", {
                      totalHits: link.totalHits,
                      hits: pluralize({
                        value: link.totalHits,
                        singular: t("app.hit.singular"),
                        plural: t("app.hit.plural"),
                        genitive: t("app.hit.genitive"),
                      }),
                      visitors: pluralize({
                        value: link.uniqueVisitors,
                        singular: t("app.visitor.singular"),
                        plural: t("app.visitor.plural"),
                        genitive: t("app.visitor.genitive"),
                      }),
                      uniqueVisitors: link.uniqueVisitors,
                    })}
                  </div>
                )}
              </div>

              <div data-stack="y" data-gap="3" data-ml="auto">
                {link.status === "active" && (
                  <div
                    data-stack="x"
                    data-cross="center"
                    data-gap="1"
                    data-fs="xs"
                    data-color="neutral-400"
                    data-ml="auto"
                  >
                    <Icons.Clock data-size="xs" />
                    {t("profile.shareable_links.expires_at", { date: link.expiresAt })}
                  </div>
                )}

                {link.status === "revoked" && (
                  <div
                    data-stack="x"
                    data-cross="center"
                    data-gap="1"
                    data-fs="xs"
                    data-color="neutral-400"
                    data-ml="auto"
                  >
                    <Icons.Clock data-size="xs" />
                    {t("profile.shareable_links.revoked_at", { date: link.updatedAt })}
                  </div>
                )}

                {link.status === "expired" && (
                  <div data-fs="xs" data-color="neutral-400" data-ml="auto">
                    {t("profile.shareable_links.expired_at", { date: link.expiresAt })}
                  </div>
                )}

                {link.status === "active" && (
                  <div data-stack="x" data-gap="3" data-ml="auto">
                    <RR.Link to={`/shared-entries/${link.id}`} target="_blank">
                      <button type="button" className="c-button" data-variant="bare">
                        <Icons.OpenInWindow data-size="md" />
                      </button>
                    </RR.Link>

                    <Components.CopyButton text={`http://localhost:5173/shared-entries/${link.id}`} />

                    <RR.Form method="POST" action=".">
                      <input name="id" type="hidden" value={link.id} />
                      <input name="revision" type="hidden" value={link.revision} />
                      <input name="intent" type="hidden" value="shareable_link_revoke" />
                      <button type="submit" className="c-button" data-variant="secondary">
                        {t("profile.shareable_links.revoke.cta")}
                      </button>
                    </RR.Form>
                  </div>
                )}

                {["revoked", "expired"].includes(link.status) && (
                  <div data-stack="x" data-gap="3" data-ml="auto">
                    <RR.Form method="POST" action=".">
                      <input name="shareableLinkId" type="hidden" value={link.id} />
                      <input name="intent" type="hidden" value="shareable_link_hide" />
                      <button type="submit" className="c-button" data-variant="secondary">
                        {t("profile.shareable_links.hide.cta")}
                      </button>
                    </RR.Form>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div data-stack="y" data-gap="5">
        <div data-stack="x" data-cross="center" data-gap="3">
          <Icons.DownloadCircle data-size="md" />
          <div>{t("profile.export_all_data.header")}</div>
        </div>

        <a
          type="button"
          href={`${import.meta.env.VITE_API_URL}/entry/export-data`}
          download
          target="_blank"
          rel="noopener noreferer"
          className="c-button"
          data-variant="secondary"
          data-disp="flex"
          data-main="center"
          data-cross="center"
          data-mr="auto"
        >
          {t("profile.export_all_data.cta")}
        </a>
      </div>

      <Components.ChangePassword email={session?.user.email as string} />

      <Components.DeleteAccount />
    </main>
  );
}
