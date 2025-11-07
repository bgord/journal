import { useTranslations } from "@bgord/ui";
import { ListEmpty } from "./list-empty";

export function DashboardCellEmpty(props: React.JSX.IntrinsicElements["div"]) {
  const t = useTranslations();

  return <ListEmpty {...props}>{t("dashboard.section.empty")}</ListEmpty>;
}
