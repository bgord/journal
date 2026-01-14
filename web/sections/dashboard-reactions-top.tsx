import { useTranslations } from "@bgord/ui";
import { Form } from "../../app/services/home-entry-add-form";
import { DashboardCell, DashboardCellEmpty, DashboardSubheader } from "../components";
import { dashboardRoute } from "../router";

export function DashboardReactionsTop() {
  const t = useTranslations();

  const dashboard = dashboardRoute.useLoaderData();

  return (
    <DashboardCell>
      <DashboardSubheader>{t("dashboard.entries.reactions")}</DashboardSubheader>

      {!dashboard?.entries.top.reactions[0] && <DashboardCellEmpty />}

      {dashboard?.entries.top.reactions[0] && (
        <ul data-stack="y" data-gap="6">
          {dashboard?.entries.top.reactions.map((reaction) => (
            <li key={reaction.id} data-stack="y" data-gap="2">
              <div data-stack="x" data-cross="center" data-gap="2">
                <div className="c-badge" data-variant="primary">
                  {reaction.reactionEffectiveness} / {Form.reactionEffectiveness.max}
                </div>
                <div data-color="neutral-500">{t(`entry.reaction.type.value.${reaction.reactionType}`)}</div>
              </div>

              <div data-ml="1">"{reaction.reactionDescription}"</div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCell>
  );
}
