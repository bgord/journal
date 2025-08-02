import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as RR from "react-router";
import { API } from "../../api";
import { guard } from "../../auth";
import { ReadModel } from "../../read-model";
import type { Route } from "./+types/profile";

export function meta() {
  return [{ title: "Journal" }, { name: "description", content: "The Journal App" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await guard.getServerSession(request);
  const userId = session?.user.id as string;

  const shareableLinks = await ReadModel.listShareableLinks(userId);

  return { shareableLinks };
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

  throw new Error("Intent unknown");
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  return (
    <main
      data-disp="flex"
      data-dir="column"
      data-gap="8"
      data-mt="8"
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
        data-disp="flex"
        data-cross="center"
        data-gap="3"
        data-pb="5"
        data-fw="bold"
        data-fs="base"
        data-bcb="neutral-800"
        data-bwb="hairline"
      >
        <Icons.ProfileCircle data-size="md" data-color="brand-300" /> Profile
      </h2>

      <div data-disp="flex" data-dir="column" data-gap="5">
        <div>Shareable links</div>

        <ul data-disp="flex" data-dir="column" data-gap="5">
          {loaderData.shareableLinks.map((link) => (
            <li
              key={link.id}
              data-disp="flex"
              data-cross="center"
              data-py="2"
              data-px="4"
              data-fs="sm"
              data-bg="neutral-800"
            >
              {link.status === "active" && (
                <div className="c-badge" data-variant="primary" data-mr="5">
                  {link.status}
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
                  {link.status}
                </div>
              )}

              <div data-disp="flex" data-dir="column" data-gap="1">
                <div data-mr="2">{link.publicationSpecification.toUpperCase()} from date range</div>

                <div data-color="neutral-300">
                  {link.dateRangeStart} - {link.dateRangeEnd}
                </div>
              </div>

              <div data-disp="flex" data-dir="column" data-gap="3" data-ml="auto">
                {link.status === "active" && (
                  <div data-fs="xs" data-color="neutral-400" data-ml="auto">
                    expires at {link.expiresAt}
                  </div>
                )}

                {link.status === "revoked" && (
                  <div data-fs="xs" data-color="neutral-400" data-ml="auto">
                    revoked at {link.updatedAt}
                  </div>
                )}

                {link.status === "expired" && (
                  <div data-fs="xs" data-color="neutral-400" data-ml="auto">
                    expired at {link.expiresAt}
                  </div>
                )}

                {link.status === "active" && (
                  <div data-disp="flex" data-gap="5">
                    <button
                      type="button"
                      className="c-button"
                      data-ml="auto"
                      onClick={() =>
                        UI.copyToClipboard({
                          // TODO: add correct link
                          text: `https://localhost:5173/${link.id}`,
                        })
                      }
                    >
                      <Icons.Copy data-size="md" />
                    </button>

                    <RR.Form method="POST" action=".">
                      <input name="id" type="hidden" value={link.id} />
                      <input name="revision" type="hidden" value={link.revision} />
                      <input name="intent" type="hidden" value="shareable_link_revoke" />
                      <button
                        type="submit"
                        className="c-button"
                        data-variant="primary"
                        data-color="danger-400"
                        data-bg="danger-900"
                      >
                        revoke
                      </button>
                    </RR.Form>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div data-disp="flex" data-gap="5">
        <div>Export all data</div>

        <a
          href={`${import.meta.env.VITE_API_URL}/entry/export`}
          download
          target="_blank"
          rel="noopener noreferer"
          data-color="brand-500"
        >
          <Icons.DownloadCircle data-size="lg" />
        </a>
      </div>
    </main>
  );
}
