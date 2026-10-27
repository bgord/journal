import { LoadMoreState, type UseLoadMoreReturnType, useTranslations } from "@bgord/ui";
import { NavArrowDown } from "iconoir-react";

type LoadMoreProps = { list: Pick<UseLoadMoreReturnType<unknown, unknown>, "next" | "state" | "more"> };

export function LoadMore(props: LoadMoreProps) {
  const t = useTranslations();

  const loading = props.list.state === LoadMoreState.loading;

  return (
    <>
      {props.list.next !== null && (
        <button
          aria-busy={loading}
          className="c-button"
          data-mt="5"
          data-mx="auto"
          data-variant="with-icon"
          disabled={loading}
          onClick={props.list.more}
          type="button"
        >
          <NavArrowDown data-size="md" />
          {t("list.more.cta")}
        </button>
      )}

      {props.list.state === LoadMoreState.error && (
        <output aria-live="assertive" data-color="danger-400" data-fs="sm" data-mt="3" data-mx="auto">
          {t("list.more.error")}
        </output>
      )}
    </>
  );
}
