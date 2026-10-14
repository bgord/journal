import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as AI from "+ai";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Invariants from "+emotions/invariants";
import * as VO from "+emotions/value-objects";

export type WeeklyReviewEventType =
  | Events.WeeklyReviewRequestedEventType
  | Events.WeeklyReviewSkippedEventType
  | Events.WeeklyReviewCompletedEventType
  | Events.WeeklyReviewFailedEventType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export class WeeklyReview {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<WeeklyReviewEventType>({
    [Events.WEEKLY_REVIEW_REQUESTED_EVENT]: Events.WeeklyReviewRequestedEvent,
    [Events.WEEKLY_REVIEW_SKIPPED_EVENT]: Events.WeeklyReviewSkippedEvent,
    [Events.WEEKLY_REVIEW_COMPLETED_EVENT]: Events.WeeklyReviewCompletedEvent,
    [Events.WEEKLY_REVIEW_FAILED_EVENT]: Events.WeeklyReviewFailedEvent,
  });
  // Stryker restore all

  readonly id: VO.WeeklyReviewIdType;
  private state?: { userId: Auth.VO.UserIdType; week: tools.Week };
  private status: VO.WeeklyReviewStatusEnum = VO.WeeklyReviewStatusEnum.initial;
  private insights?: AI.Advice;

  private readonly pending: Array<WeeklyReviewEventType> = [];

  private constructor(
    id: VO.WeeklyReviewIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(
    id: VO.WeeklyReviewIdType,
    events: ReadonlyArray<WeeklyReviewEventType>,
    deps: Dependencies,
  ): WeeklyReview {
    const entry = new WeeklyReview(id, deps);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  static request(
    id: VO.WeeklyReviewIdType,
    week: tools.Week,
    requesterId: Auth.VO.UserIdType,
    deps: Dependencies,
  ) {
    const weeklyReview = new WeeklyReview(id, deps);

    const event = bg.event(
      Events.WeeklyReviewRequestedEvent,
      WeeklyReview.getStream(id),
      { weeklyReviewId: id, weekIsoId: week.toIsoId(), userId: requesterId },
      deps,
    );

    weeklyReview.record(event);

    return weeklyReview;
  }

  complete(insights: AI.Advice) {
    Invariants.WeeklyReviewCompletedOnce.enforce({ status: this.status });
    const { weeklyReview } = Invariants.WeeklyReviewExists.enforce({ weeklyReview: this.state });

    const event = bg.event(
      Events.WeeklyReviewCompletedEvent,
      WeeklyReview.getStream(this.id),
      {
        weeklyReviewId: this.id,
        weekIsoId: weeklyReview.week.toIsoId(),
        insights: insights.get(),
        userId: weeklyReview.userId,
      },
      this.deps,
    );

    this.record(event);
  }

  fail() {
    Invariants.WeeklyReviewCompletedOnce.enforce({ status: this.status });
    const { weeklyReview } = Invariants.WeeklyReviewExists.enforce({ weeklyReview: this.state });

    const event = bg.event(
      Events.WeeklyReviewFailedEvent,
      WeeklyReview.getStream(this.id),
      {
        weeklyReviewId: this.id,
        weekIsoId: weeklyReview.week.toIsoId(),
        userId: weeklyReview.userId,
      },
      this.deps,
    );

    this.record(event);
  }

  toSnapshot() {
    return {
      id: this.id,
      userId: this.state?.userId,
      week: this.state?.week,
      status: this.status,
      insights: this.insights,
    };
  }

  pullEvents(): ReadonlyArray<WeeklyReviewEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: WeeklyReviewEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: WeeklyReviewEventType): void {
    switch (event.name) {
      case Events.WEEKLY_REVIEW_REQUESTED_EVENT: {
        this.state = { userId: event.payload.userId, week: tools.Week.fromIsoId(event.payload.weekIsoId) };
        this.status = VO.WeeklyReviewStatusEnum.requested;
        break;
      }

      case Events.WEEKLY_REVIEW_COMPLETED_EVENT: {
        this.status = VO.WeeklyReviewStatusEnum.completed;
        this.insights = new AI.Advice(event.payload.insights);
        break;
      }

      case Events.WEEKLY_REVIEW_FAILED_EVENT: {
        this.status = VO.WeeklyReviewStatusEnum.failed;
        break;
      }
    }
  }

  static getStream(id: VO.WeeklyReviewIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `weekly_review_${id}`);
  }
}
