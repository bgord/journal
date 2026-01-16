import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as z from "zod/v4";
import type * as Auth from "+auth";
import * as Events from "+publishing/events";
import * as Invariants from "+publishing/invariants";
import * as VO from "+publishing/value-objects";

export type ShareableLinkEvent = (typeof ShareableLink)["events"][number];
type ShareableLinkEventType = z.infer<ShareableLinkEvent>;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class ShareableLink {
  // Stryker disable all
  static readonly events = [
    Events.ShareableLinkCreatedEvent,
    Events.ShareableLinkExpiredEvent,
    Events.ShareableLinkRevokedEvent,
  ];
  // Stryker restore all

  readonly id: VO.ShareableLinkIdType;
  private ownerId?: Auth.VO.UserIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private status?: VO.ShareableLinkStatusEnum = VO.ShareableLinkStatusEnum.active;
  private createdAt?: tools.TimestampValueType;
  private durationMs?: tools.DurationMsType;
  private dateRange?: tools.DateRange;
  private publicationSpecification?: VO.PublicationSpecificationType;

  private readonly pending: ShareableLinkEventType[] = [];

  private constructor(
    id: VO.ShareableLinkIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(
    id: VO.ShareableLinkIdType,
    events: ShareableLinkEventType[],
    deps: Dependencies,
  ): ShareableLink {
    const shareableLink = new ShareableLink(id, deps);

    events.forEach((event) => shareableLink.apply(event));

    return shareableLink;
  }

  static create(
    id: VO.ShareableLinkIdType,
    publicationSpecification: VO.PublicationSpecificationType,
    dateRange: tools.DateRange,
    durationMs: tools.DurationMsType,
    requesterId: Auth.VO.UserIdType,
    deps: Dependencies,
  ) {
    const shareableLink = new ShareableLink(id, deps);

    const event = Events.ShareableLinkCreatedEvent.parse({
      ...bg.createEventEnvelope(ShareableLink.getStream(id), deps),
      name: Events.SHAREABLE_LINK_CREATED_EVENT,
      payload: {
        shareableLinkId: id,
        ownerId: requesterId,
        dateRangeStart: dateRange.getStart().ms,
        dateRangeEnd: dateRange.getEnd().ms,
        publicationSpecification,
        durationMs,
        createdAt: deps.Clock.now().ms,
      },
    } satisfies Events.ShareableLinkCreatedEventType);

    shareableLink.record(event);

    return shareableLink;
  }

  expire() {
    Invariants.ShareableLinkIsActive.enforce({ status: this.status });
    Invariants.ShareableLinkExpirationTimePassed.enforce({
      durationMs: this.durationMs,
      now: this.deps.Clock.now(),
      createdAt: this.createdAt,
    });

    const event = Events.ShareableLinkExpiredEvent.parse({
      ...bg.createEventEnvelope(ShareableLink.getStream(this.id), this.deps),
      name: Events.SHAREABLE_LINK_EXPIRED_EVENT,
      payload: { shareableLinkId: this.id },
    } satisfies Events.ShareableLinkExpiredEventType);

    this.record(event);
  }

  revoke(requesterId: Auth.VO.UserIdType) {
    Invariants.ShareableLinkIsActive.enforce({ status: this.status });
    Invariants.RequesterOwnsShareableLink.enforce({ requesterId, ownerId: this.ownerId });

    const event = Events.ShareableLinkRevokedEvent.parse({
      ...bg.createEventEnvelope(ShareableLink.getStream(this.id), this.deps),
      name: Events.SHAREABLE_LINK_REVOKED_EVENT,
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
    return !this.createdAt;
  }

  summarize() {
    return {
      ownerId: this.ownerId as Auth.VO.UserIdType,
      dateRange: this.dateRange as tools.DateRange,
      publicationSpecification: this.publicationSpecification as VO.PublicationSpecificationType,
      status: this.status,
    } as const;
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
        this.durationMs = event.payload.durationMs;
        this.createdAt = event.payload.createdAt;
        this.ownerId = event.payload.ownerId;
        this.status = VO.ShareableLinkStatusEnum.active;
        this.dateRange = new tools.DateRange(
          tools.Timestamp.fromValue(event.payload.dateRangeStart),
          tools.Timestamp.fromValue(event.payload.dateRangeEnd),
        );
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
