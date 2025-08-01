import type * as Auth from "+auth";
import * as Events from "+publishing/events";
import * as Policies from "+publishing/policies";
import * as VO from "+publishing/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export type ShareableLinkEvent = (typeof ShareableLink)["events"][number];
type ShareableLinkEventType = z.infer<ShareableLinkEvent>;

export class ShareableLink {
  static events = [
    Events.ShareableLinkCreatedEvent,
    Events.ShareableLinkExpiredEvent,
    Events.ShareableLinkRevokedEvent,
  ];

  readonly id: VO.ShareableLinkIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.initial);
  private status?: VO.ShareableLinkStatusEnum = VO.ShareableLinkStatusEnum.active;
  private createdAt?: tools.TimestampType;
  private duration?: tools.TimeResult;

  private readonly pending: ShareableLinkEventType[] = [];

  private constructor(id: VO.ShareableLinkIdType) {
    this.id = id;
  }

  static build(id: VO.ShareableLinkIdType, events: ShareableLinkEventType[]): ShareableLink {
    const shareableLink = new ShareableLink(id);

    events.forEach((event) => shareableLink.apply(event));

    return shareableLink;
  }

  static create(
    id: VO.ShareableLinkIdType,
    publicationSpecification: VO.PublicationSpecificationType,
    dateRange: tools.DateRange,
    duration: tools.TimeResult,
    requesterId: Auth.VO.UserIdType,
  ) {
    const shareableLink = new ShareableLink(id);

    const event = Events.ShareableLinkCreatedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.SHAREABLE_LINK_CREATED,
      stream: ShareableLink.getStream(id),
      version: 1,
      payload: {
        shareableLinkId: id,
        ownerId: requesterId,
        dateRangeStart: dateRange.getStart(),
        dateRangeEnd: dateRange.getEnd(),
        publicationSpecification,
        durationMs: tools.Timestamp.parse(duration.ms),
      },
    } satisfies Events.ShareableLinkCreatedEventType);

    shareableLink.record(event);

    return shareableLink;
  }

  expire() {
    Policies.ShareableLinkIsActive.perform({ status: this.status });
    Policies.ShareableLinkExpirationTimePassed.perform({
      duration: this.duration,
      now: Date.now(),
      createdAt: this.createdAt,
    });

    const event = Events.ShareableLinkExpiredEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.SHAREABLE_LINK_EXPIRED,
      stream: ShareableLink.getStream(this.id),
      version: 1,
      payload: { shareableLinkId: this.id },
    } satisfies Events.ShareableLinkExpiredEventType);

    this.record(event);
  }

  revoke() {
    Policies.ShareableLinkIsActive.perform({ status: this.status });

    const event = Events.ShareableLinkRevokedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.SHAREABLE_LINK_REVOKED,
      stream: ShareableLink.getStream(this.id),
      version: 1,
      payload: { shareableLinkId: this.id },
    } satisfies Events.ShareableLinkRevokedEventType);

    this.record(event);
  }

  pullEvents(): ShareableLinkEventType[] {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: ShareableLinkEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: ShareableLinkEventType): void {
    switch (event.name) {
      case Events.SHAREABLE_LINK_CREATED: {
        this.duration = tools.Time.Ms(event.payload.durationMs);
        this.createdAt = tools.Timestamp.parse(event.createdAt);
        break;
      }

      case Events.SHAREABLE_LINK_EXPIRED: {
        this.status = VO.ShareableLinkStatusEnum.expired;
        break;
      }

      case Events.SHAREABLE_LINK_REVOKED: {
        this.status = VO.ShareableLinkStatusEnum.revoked;
        break;
      }
    }
  }

  static getStream(id: VO.ShareableLinkIdType) {
    return `shareable_link_${id}`;
  }
}
