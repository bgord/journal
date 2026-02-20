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
    <Dialog
      data-dir="column"
      data-mt="12"
      style={{ ...Rhythm().times(50).width, ...Rhythm().times(40).minHeight }}
      {...dialog}
    >
      <div data-cross="center" data-main="between" data-stack="x">
        <strong data-color="neutral-300" data-cross="center" data-gap="2" data-stack="x">
          <List data-color="neutral-300" data-size="md" />
          {t("entry.history")}
        </strong>
        <ButtonClose onClick={dialog.disable} />
      </div>

      {history.length === 0 && <ListEmpty data-mt="5">{t("entry.history.empty")}</ListEmpty>}

      <ul data-gap="2" data-mt="5" data-stack="y">
        {history.map((item) => (
          <li data-color="neutral-300" data-main="between" data-stack="x" key={item.id}>
            <div>- {t(item.operation, item.payload)}</div>
            <div data-color="neutral-500" data-fs="xs" data-transform="font-variant-numeric">
              {item.createdAt}
            </div>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
