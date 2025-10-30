import { useTranslations } from "@bgord/ui";

export function DashboardCellEmpty(props: React.JSX.IntrinsicElements["div"]) {
  const t = useTranslations();

  return (
    <div data-fs="sm" data-color="neutral-400" {...props}>
      {t("dashboard.section.empty")}
    </div>
  );
}
