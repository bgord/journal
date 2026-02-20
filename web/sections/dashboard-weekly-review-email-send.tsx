import { useMutation } from "@bgord/ui";
import { Check, SendMail } from "iconoir-react";
import type { DashboardDataType } from "../api";

export function DashboardWeeklyReviewEmailSend(props: DashboardDataType["weeklyReviews"][number]) {
  const mutation = useMutation({
    perform: () =>
      fetch(`/api/weekly-review/${props.id}/export/email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }),
    autoResetDelayMs: 1500,
  });

  return (
    <form onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-pt="2"
        data-variant="bare"
        disabled={mutation.isLoading || mutation.isDone}
        type="submit"
      >
        {!mutation.isDone && <SendMail data-animation="grow-fade-in" data-color="brand-500" data-size="lg" />}
        {mutation.isDone && <Check data-animation="grow-fade-in" data-color="positive-400" data-size="lg" />}
      </button>
    </form>
  );
}
