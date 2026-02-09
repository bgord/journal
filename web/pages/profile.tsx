import { useTranslations } from "@bgord/ui";
import { Separator } from "../components";
import { rootRoute } from "../router";
import {
  ProfileAccountDelete,
  ProfileAiUsage,
  ProfileAvatarChange,
  ProfileDataExport,
  ProfileLanguageSelector,
  ProfilePasswordChange,
  ProfileShareableLinkList,
} from "../sections";

/** @public */
export function Profile() {
  const t = useTranslations();
  const { session } = rootRoute.useLoaderData();

  return (
    <main
      data-stack="y"
      data-gap="6"
      data-mt="8"
      data-mx="auto"
      data-p="8"
      data-width="100%"
      data-maxw="md"
      data-br="sm"
      data-bg="neutral-900"
      data-md-m="2"
      data-md-pb="8"
    >
      <header data-stack="x" data-main="between">
        <h2 data-fw="bold">{t("profile.header")}</h2>
        <div data-fs="sm">{session.user.email}</div>
      </header>
      <Separator />
      <ProfileAvatarChange />
      <Separator />
      <ProfileAiUsage />
      <Separator />
      <ProfileShareableLinkList />
      <Separator />
      <ProfileLanguageSelector />
      <Separator />
      <ProfileDataExport />
      <Separator />
      <ProfilePasswordChange />
      <Separator />
      <ProfileAccountDelete />
    </main>
  );
}
