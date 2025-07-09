import { Xmark } from "iconoir-react";
import { useFetcher } from "react-router";
import type { SelectEmotionJournalEntries } from "../../infra/schema";

export function EntryDelete(props: Pick<SelectEmotionJournalEntries, "id">) {
  const fetcher = useFetcher();

  const isDeleting = fetcher.state !== "idle";

  return (
    <fetcher.Form method="delete">
      <input type="hidden" name="id" value={props.id} />
      <button
        className="c-button"
        data-variant="with-icon"
        type="submit"
        title="Delete entry"
        disabled={isDeleting}
        data-interaction="subtle-scale"
      >
        <Xmark width={20} height={20} />
      </button>
    </fetcher.Form>
  );
}
