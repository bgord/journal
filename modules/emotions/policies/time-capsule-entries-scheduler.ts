import * as Events from "+app/events";
import * as Invariants from "+emotions/invariants";
import type { EventBus } from "+infra/event-bus";

export class TimeCapsuleEntriesScheduler {
  constructor(private readonly eventBus: typeof EventBus) {
    this.eventBus.on(Events.HOUR_HAS_PASSED_EVENT, this.onHourHasPassed.bind(this));
  }

  async onHourHasPassed(event: Events.HourHasPassedEventType) {
    if (Invariants.WeeklyReviewSchedule.fails({ timestamp: event.payload.timestamp })) return;
  }
}
