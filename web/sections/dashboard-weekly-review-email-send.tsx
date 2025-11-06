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
        type="submit"
        className="c-button"
        data-variant="bare"
        data-pt="2"
        disabled={mutation.isLoading || mutation.isDone}
      >
        {!mutation.isDone && <SendMail data-color="brand-500" data-size="lg" data-animation="grow-fade-in" />}
        {mutation.isDone && <Check data-color="positive-400" data-size="lg" data-animation="grow-fade-in" />}
      </button>
    </form>
  );
}
