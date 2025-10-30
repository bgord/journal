import { Check, SendMail } from "iconoir-react";
import React from "react";
import type { DashboardDataType } from "../api";
import { RequestState } from "../ui";

const DELAY_MS = 1500;

export function DashboardWeeklyReviewEmailSend(props: DashboardDataType["weeklyReviews"][number]) {
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  async function sendWeeklyReviewEmail(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch(`/api/weekly-review/${props.id}/export/email`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    setTimeout(() => setState(RequestState.idle), DELAY_MS);
  }

  return (
    <form onSubmit={sendWeeklyReviewEmail}>
      <button
        type="submit"
        className="c-button"
        data-variant="bare"
        data-pt="2"
        disabled={[RequestState.loading, RequestState.done].includes(state)}
      >
        {state !== RequestState.done && (
          <SendMail data-color="brand-500" data-size="lg" data-animation="grow-fade-in" />
        )}
        {state === RequestState.done && (
          <Check data-color="positive-400" data-size="lg" data-animation="grow-fade-in" />
        )}
      </button>
    </form>
  );
}
