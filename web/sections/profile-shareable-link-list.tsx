import { useTranslations } from "@bgord/ui";
import { ShareIos } from "iconoir-react";
import { ListEmpty } from "../components";
import { profileRoute } from "../router";
import { ProfileShareableLink } from "./profile-shareable-link";
import { ProfileShareableLinkCreate } from "./profile-shareable-link-create";

export function ProfileShareableLinkList() {
  const t = useTranslations();
  const { shareableLinks } = profileRoute.useLoaderData();

  return (
    <div data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <ShareIos data-size="md" />
        <div>{t("profile.shareable_links.header")}</div>
        <ProfileShareableLinkCreate />
      </div>

      {!shareableLinks[0] && <ListEmpty>{t("profile.shareable_links.empty")}</ListEmpty>}

      {shareableLinks[0] && (
        <ul data-gap="5" data-stack="y">
          {shareableLinks.map((link) => (
            <ProfileShareableLink key={link.id} {...link} />
          ))}
        </ul>
      )}
    </div>
  );
}
