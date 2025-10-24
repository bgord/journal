import { usePluralize, useTranslations } from "@bgord/ui";
import { useLoaderData } from "@tanstack/react-router";
import { CheckSquare, EnergyUsageWindow, InfoCircle } from "iconoir-react";
import { profileRoute } from "../router";

export function ProfileAiUsage() {
  const t = useTranslations();
  const pluralize = usePluralize();
  const { usage } = useLoaderData({ from: profileRoute.id });

  return (
    <div data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <EnergyUsageWindow data-size="md" />
        <div>{t("profile.ai_limits.header")}</div>

        <div data-stack="x" data-cross="center" data-gap="2" data-ml="auto">
          <InfoCircle data-size="sm" />
          <span data-fs="xs">{t("profile.ai_limits.resets_in", { hours: "todo" })}</span>
        </div>
      </div>

      {!usage && <div data-color="neutral-400">{t("profile.ai_limits.empty")}</div>}

      {usage && (
        <div data-stack="x" data-cross="center" data-gap="3" data-color="neutral-400">
          {!usage.consumed && <CheckSquare data-size="md" data-color="positive-400" />}
          {usage.consumed && <CheckSquare data-size="md" data-color="danger-400" />}

          {t("profile.ai_limits.usage", {
            count: usage.count,
            limit: usage.limit,
            noun: pluralize({
              value: usage.count,
              singular: t("app.prompt.singular"),
              plural: t("app.prompt.plural"),
            }),
          })}
        </div>
      )}
    </div>
  );
}
