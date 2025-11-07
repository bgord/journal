import { Dialog, Rhythm, useToggle, useTranslations } from "@bgord/ui";
import { useNavigate } from "@tanstack/react-router";
import { List } from "iconoir-react";
import { Form } from "../../app/services/home-entry-list-form";
import { ButtonClose, ListEmpty } from "../components";
import { homeEntryHistoryRoute, homeRoute } from "../router";

/** @public */
export function HomeEntryHistory() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { history } = homeEntryHistoryRoute.useLoaderData();
  const params = homeEntryHistoryRoute.useParams();

  const builder = useToggle({ name: `entry-history-${params.entryId}` });
  const dialog = {
    ...builder,
    on: true,
    disable: () => navigate({ to: homeRoute.to, search: Form.default }),
  };

  return (
    <Dialog data-dir="column" data-mt="12" {...Rhythm().times(50).style.width} {...dialog}>
      <div data-stack="x" data-main="between" data-cross="center">
        <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
          <List data-size="md" data-color="neutral-300" />
          {t("entry.history")}
        </strong>
        <ButtonClose onClick={dialog.disable} />
      </div>

      {history.length === 0 && <ListEmpty data-mt="5">{t("entry.history.empty")}</ListEmpty>}

      <ul data-stack="y" data-gap="2" data-mt="5">
        {history.map((item) => (
          <li key={item.id} data-stack="x" data-main="between" data-color="neutral-300">
            <div>- {t(item.operation, item.payload)}</div>
            <div data-fs="xs" data-color="neutral-500" data-transform="font-variant-numeric">
              {item.createdAt}
            </div>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
