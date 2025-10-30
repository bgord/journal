import { useTranslations } from "@bgord/ui";

export function DashboardCellEmpty(props: React.JSX.IntrinsicElements["div"]) {
  const t = useTranslations();

  return (
    <div data-mt="5" data-fs="sm" data-color="neutral-400" {...props}>
      {t("No related records yet")}
    </div>
  );
}
