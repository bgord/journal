import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Policies from "+emotions/policies";
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

  private readonly id: VO.WeeklyReviewIdType;
  private userId?: Auth.VO.UserIdType;
  private weekStartedAt?: tools.TimestampType;
  private status: VO.WeeklyReviewStatusEnum = VO.WeeklyReviewStatusEnum.initial;
  // @ts-expect-error
  private insights?: VO.Advice;

  private readonly pending: WeeklyReviewEventType[] = [];

  private constructor(id: VO.WeeklyReviewIdType) {
    this.id = id;
  }

  static create(id: VO.WeeklyReviewIdType): WeeklyReview {
    return new WeeklyReview(id);
  }

  static build(id: VO.WeeklyReviewIdType, events: WeeklyReviewEventType[]): WeeklyReview {
    const entry = new WeeklyReview(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async request(weekStart: VO.WeekStart, requesterId: Auth.VO.UserIdType) {
    await Policies.WeeklyReviewRequestedOnce.perform({ status: this.status });

    const event = Events.WeeklyReviewRequestedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      stream: WeeklyReview.getStream(this.id),
      version: 1,
      payload: { weeklyReviewId: this.id, weekStartedAt: weekStart.get(), userId: requesterId },
    } satisfies Events.WeeklyReviewRequestedEventType);

    this.record(event);
  }

  async complete(insights: VO.Advice) {
    await Policies.WeeklyReviewCompletedOnce.perform({ status: this.status });

    const event = Events.WeeklyReviewCompletedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      stream: WeeklyReview.getStream(this.id),
      version: 1,
      payload: {
        weeklyReviewId: this.id,
        weekStartedAt: this.weekStartedAt as tools.TimestampType,
        insights: insights.get(),
        userId: this.userId as Auth.VO.UserIdType,
      },
    } satisfies Events.WeeklyReviewCompletedEventType);

    this.record(event);
  }

  async fail() {
    await Policies.WeeklyReviewCompletedOnce.perform({ status: this.status });

    const event = Events.WeeklyReviewFailedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_FAILED_EVENT,
      stream: WeeklyReview.getStream(this.id),
      version: 1,
      payload: {
        weeklyReviewId: this.id,
        weekStartedAt: this.weekStartedAt as tools.TimestampType,
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
        this.weekStartedAt = event.payload.weekStartedAt;
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
