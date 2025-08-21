import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { z } from "zod/v4";
import type * as Auth from "+auth";
import * as Events from "+publishing/events";
import * as Invariants from "+publishing/invariants";
import * as VO from "+publishing/value-objects";

export type ShareableLinkEvent = (typeof ShareableLink)["events"][number];
type ShareableLinkEventType = z.infer<ShareableLinkEvent>;

export class ShareableLink {
  static events = [
    Events.ShareableLinkCreatedEvent,
    Events.ShareableLinkExpiredEvent,
    Events.ShareableLinkRevokedEvent,
  ];

  readonly id: VO.ShareableLinkIdType;
  private ownerId?: Auth.VO.UserIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.initial);
  private status?: VO.ShareableLinkStatusEnum = VO.ShareableLinkStatusEnum.active;
  private createdAt?: tools.TimestampType;
  private duration?: tools.TimeResult;
  private dateRange?: tools.DateRange;
  private publicationSpecification?: VO.PublicationSpecificationType;

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
      createdAt: tools.Time.Now().value,
      name: Events.SHAREABLE_LINK_CREATED_EVENT,
      stream: ShareableLink.getStream(id),
      version: 1,
      payload: {
        shareableLinkId: id,
        ownerId: requesterId,
        dateRangeStart: dateRange.getStart(),
        dateRangeEnd: dateRange.getEnd(),
        publicationSpecification,
        durationMs: tools.Timestamp.parse(duration.ms),
        createdAt: tools.Time.Now().value,
      },
    } satisfies Events.ShareableLinkCreatedEventType);

    shareableLink.record(event);

    return shareableLink;
  }

  expire() {
    Invariants.ShareableLinkIsActive.perform({ status: this.status });
    Invariants.ShareableLinkExpirationTimePassed.perform({
      duration: this.duration,
      now: Date.now(),
      createdAt: this.createdAt,
    });

    const event = Events.ShareableLinkExpiredEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: Events.SHAREABLE_LINK_EXPIRED_EVENT,
      stream: ShareableLink.getStream(this.id),
      version: 1,
      payload: { shareableLinkId: this.id },
    } satisfies Events.ShareableLinkExpiredEventType);

    this.record(event);
  }

  revoke(requesterId: Auth.VO.UserIdType) {
    Invariants.ShareableLinkIsActive.perform({ status: this.status });
    Invariants.RequesterOwnsShareableLink.perform({ requesterId, ownerId: this.ownerId });

    const event = Events.ShareableLinkRevokedEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: Events.SHAREABLE_LINK_REVOKED_EVENT,
      stream: ShareableLink.getStream(this.id),
      version: 1,
      payload: { shareableLinkId: this.id },
    } satisfies Events.ShareableLinkRevokedEventType);

    this.record(event);
  }

  isValid(publicationSpecification: VO.PublicationSpecificationType): boolean {
    return (
      Invariants.ShareableLinkIsActive.passes({ status: this.status }) &&
      publicationSpecification === this.publicationSpecification
    );
  }

  isEmpty(): boolean {
    return !(
      this.createdAt &&
      this.duration &&
      this.ownerId &&
      this.dateRange &&
      this.publicationSpecification
    );
  }

  summarize() {
    return {
      ownerId: this.ownerId as Auth.VO.UserIdType,
      dateRange: this.dateRange as tools.DateRange,
      publicationSpecification: this.publicationSpecification as VO.PublicationSpecificationType,
      status: this.status,
    };
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
      case Events.SHAREABLE_LINK_CREATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.duration = tools.Time.Ms(event.payload.durationMs);
        this.createdAt = tools.Timestamp.parse(event.payload.createdAt);
        this.ownerId = event.payload.ownerId;
        this.status = VO.ShareableLinkStatusEnum.active;
        this.dateRange = new tools.DateRange(event.payload.dateRangeStart, event.payload.dateRangeEnd);
        this.publicationSpecification = event.payload.publicationSpecification;
        break;
      }

      case Events.SHAREABLE_LINK_EXPIRED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.ShareableLinkStatusEnum.expired;
        break;
      }

      case Events.SHAREABLE_LINK_REVOKED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.ShareableLinkStatusEnum.revoked;
        break;
      }
    }
  }

  static getStream(id: VO.ShareableLinkIdType) {
    return `shareable_link_${id}`;
  }
}
