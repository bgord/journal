import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Invariants from "+emotions/invariants";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export type WeeklyReviewEvent = (typeof WeeklyReview)["events"][number];
type WeeklyReviewEventType = z.infer<WeeklyReviewEvent>;

export class WeeklyReview {
  static events = [
    Events.WeeklyReviewRequestedEvent,
    Events.WeeklyReviewSkippedEvent,
    Events.WeeklyReviewCompletedEvent,
    Events.WeeklyReviewFailedEvent,
  ];

  readonly id: VO.WeeklyReviewIdType;
  private userId?: Auth.VO.UserIdType;
  private week?: tools.Week;
  private status: VO.WeeklyReviewStatusEnum = VO.WeeklyReviewStatusEnum.initial;
  // @ts-expect-error
  private insights?: VO.Advice;

  private readonly pending: WeeklyReviewEventType[] = [];

  private constructor(id: VO.WeeklyReviewIdType) {
    this.id = id;
  }

  static build(id: VO.WeeklyReviewIdType, events: WeeklyReviewEventType[]): WeeklyReview {
    const entry = new WeeklyReview(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  static request(id: VO.WeeklyReviewIdType, week: tools.Week, requesterId: Auth.VO.UserIdType) {
    const weeklyReview = new WeeklyReview(id);

    const event = Events.WeeklyReviewRequestedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      stream: WeeklyReview.getStream(id),
      version: 1,
      payload: { weeklyReviewId: id, weekIsoId: week.toIsoId(), userId: requesterId },
    } satisfies Events.WeeklyReviewRequestedEventType);

    weeklyReview.record(event);

    return weeklyReview;
  }

  complete(insights: VO.Advice) {
    Invariants.WeeklyReviewCompletedOnce.perform({ status: this.status });

    const event = Events.WeeklyReviewCompletedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      stream: WeeklyReview.getStream(this.id),
      version: 1,
      payload: {
        weeklyReviewId: this.id,
        weekIsoId: this.week?.toIsoId() as string,
        insights: insights.get(),
        userId: this.userId as Auth.VO.UserIdType,
      },
    } satisfies Events.WeeklyReviewCompletedEventType);

    this.record(event);
  }

  fail() {
    Invariants.WeeklyReviewCompletedOnce.perform({ status: this.status });

    const event = Events.WeeklyReviewFailedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_FAILED_EVENT,
      stream: WeeklyReview.getStream(this.id),
      version: 1,
      payload: {
        weeklyReviewId: this.id,
        weekIsoId: this.week?.toIsoId() as string,
        userId: this.userId as Auth.VO.UserIdType,
      },
    } satisfies Events.WeeklyReviewFailedEventType);

    this.record(event);
  }

  pullEvents(): WeeklyReviewEventType[] {
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
        this.week = tools.Week.fromIsoId(event.payload.weekIsoId);
        this.status = VO.WeeklyReviewStatusEnum.requested;
        this.userId = event.payload.userId;
        break;
      }

      case Events.WEEKLY_REVIEW_COMPLETED_EVENT: {
        this.status = VO.WeeklyReviewStatusEnum.completed;
        this.insights = new VO.Advice(event.payload.insights);
        break;
      }

      case Events.WEEKLY_REVIEW_FAILED_EVENT: {
        this.status = VO.WeeklyReviewStatusEnum.failed;
        break;
      }
    }
  }

  static getStream(id: VO.WeeklyReviewIdType) {
    return `weekly_review_${id}`;
  }
}
