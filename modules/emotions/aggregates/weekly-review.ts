import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Events from "../events";
import * as Policies from "../policies";
import * as VO from "../value-objects";

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

  private weekStartedAt?: tools.TimestampType;
  private status: VO.WeeklyReviewStatusEnum = VO.WeeklyReviewStatusEnum.initial;
  // @ts-expect-error
  private insights?: VO.EmotionalAdvice;

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

  async request(weekStart: VO.WeekStart) {
    await Policies.WeeklyReviewRequestedOnce.perform({ status: this.status });

    const event = Events.WeeklyReviewRequestedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      stream: WeeklyReview.getStream(this.id),
      version: 1,
      payload: { weeklyReviewId: this.id, weekStartedAt: weekStart.get() },
    } satisfies Events.WeeklyReviewRequestedEventType);

    this.record(event);
  }

  async complete(insights: VO.EmotionalAdvice) {
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
      },
    } satisfies Events.WeeklyReviewCompletedEventType);

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
        break;
      }

      case Events.WEEKLY_REVIEW_COMPLETED_EVENT: {
        this.status = VO.WeeklyReviewStatusEnum.completed;
        this.insights = new VO.EmotionalAdvice(event.payload.insights);
        break;
      }

      default:
        break;
    }
  }

  static getStream(id: VO.WeeklyReviewIdType) {
    return `weekly_review_${id}`;
  }
}
