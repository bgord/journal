import { OnlineStatus, useOnlineStatus, useTranslations } from "@bgord/ui";

export function OnlineStatusBar() {
  const t = useTranslations();
  const status = useOnlineStatus();

  if (status === OnlineStatus.online) return null;

  return (
    <div data-position="absolute" data-bottom="0" data-left="0" data-bg="neutral-700" data-p="3" data-fs="sm">
      {t("app.offline")}
    </div>
  );
}
