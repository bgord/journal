import { OnlineStatus, useOnlineStatus, useTranslations } from "@bgord/ui";

export function OnlineStatusBar() {
  const t = useTranslations();
  const status = useOnlineStatus();

  if (status === OnlineStatus.online) return null;

  return (
    <div data-bg="neutral-700" data-bottom="0" data-fs="sm" data-left="0" data-p="3" data-position="absolute">
      {t("app.offline")}
    </div>
  );
}
