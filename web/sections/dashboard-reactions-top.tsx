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
        <ul data-gap="6" data-stack="y">
          {dashboard?.entries.top.reactions.map((reaction) => (
            <li data-gap="2" data-stack="y" key={reaction.id}>
              <div data-cross="center" data-gap="2" data-stack="x">
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
