import { useTranslations } from "@bgord/ui";
import { CheckSquare, EnergyUsageWindow, InfoCircle } from "iconoir-react";
import { ListEmpty } from "../components";
import { profileRoute } from "../router";

export function ProfileAiUsage() {
  const t = useTranslations();
  const { usage } = profileRoute.useLoaderData();

  return (
    <div data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <EnergyUsageWindow data-size="md" />
        <div>{t("profile.ai_limits.header")}</div>

        <div data-cross="center" data-gap="2" data-ml="auto" data-stack="x">
          <InfoCircle data-size="sm" />
          {usage && (
            <span data-fs="xs">{t("profile.ai_limits.resets_in", { count: usage.resetsInHours })}</span>
          )}
        </div>
      </div>

      {!usage && <ListEmpty>{t("profile.ai_limits.empty")}</ListEmpty>}

      {usage && (
        <div data-color="neutral-400" data-cross="center" data-fs="sm" data-gap="3" data-stack="x">
          {!usage.consumed && <CheckSquare data-color="positive-400" data-size="md" />}
          {usage.consumed && <CheckSquare data-color="danger-400" data-size="md" />}

          {t("profile.ai_limits.usage", { count: usage.count, limit: usage.limit })}
        </div>
      )}
    </div>
  );
}
