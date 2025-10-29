import { useTranslations } from "@bgord/ui";
import { Form } from "../../app/services/home-entry-add-form";
import * as Components from "../components";
import { dashboardRoute } from "../router";

export function DashboardReactionsTop() {
  const t = useTranslations();

  const dashboard = dashboardRoute.useLoaderData();

  if (!dashboard?.entries.top.reactions[0]) return null;

  return (
    <Components.DashboardCell data-mt="5">
      <h2 data-stack="x" data-gap="3" data-fs="base">
        {t("dashboard.entries.reactions")}
      </h2>

      <ul data-stack="y" data-mt="5" data-gap="5">
        {dashboard?.entries.top.reactions.map((reaction) => (
          <li
            key={reaction.id}
            data-stack="y"
            data-bct="neutral-800"
            data-bwt="hairline"
            data-pt="3"
            data-gap="3"
          >
            <div data-stack="x" data-gap="3">
              <div className="c-badge" data-variant="primary">
                {reaction.reactionEffectiveness} / {Form.reactionEffectiveness.max}
              </div>

              <div data-color="neutral-500">{t(`entry.reaction.type.value.${reaction.reactionType}`)}</div>
            </div>

            <div data-ml="3" data-color="neutral-100">
              "{reaction.reactionDescription}"
            </div>
          </li>
        ))}
      </ul>
    </Components.DashboardCell>
  );
}
