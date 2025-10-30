import { useTranslations } from "@bgord/ui";
import { Form } from "../../app/services/home-entry-add-form";
import { DashboardCell, DashboardCellEmpty, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardReactionsTop() {
  const t = useTranslations();

  const dashboard = dashboardRoute.useLoaderData();

  if (!dashboard?.entries.top.reactions[0]) return null;

  return (
    <DashboardCell>
      <DashboardSubheader>{t("dashboard.entries.reactions")}</DashboardSubheader>

      {!dashboard?.entries.top.reactions[0] && <DashboardCellEmpty />}

      <ul data-stack="y" data-gap="5">
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
    </DashboardCell>
  );
}
