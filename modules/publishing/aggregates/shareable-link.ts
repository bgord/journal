import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Events from "+publishing/events";
import * as Invariants from "+publishing/invariants";
import * as VO from "+publishing/value-objects";

export type ShareableLinkEventType =
  | Events.ShareableLinkCreatedEventType
  | Events.ShareableLinkExpiredEventType
  | Events.ShareableLinkRevokedEventType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export class ShareableLink {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<ShareableLinkEventType>({
    [Events.SHAREABLE_LINK_CREATED_EVENT]: Events.ShareableLinkCreatedEvent,
    [Events.SHAREABLE_LINK_EXPIRED_EVENT]: Events.ShareableLinkExpiredEvent,
    [Events.SHAREABLE_LINK_REVOKED_EVENT]: Events.ShareableLinkRevokedEvent,
  });
  // Stryker restore all

  readonly id: VO.ShareableLinkIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private status?: VO.ShareableLinkStatusEnum = VO.ShareableLinkStatusEnum.active;
  private state?: {
    ownerId: Auth.VO.UserIdType;
    createdAt: tools.TimestampValueType;
    durationMs: tools.DurationMsType;
    dateRange: tools.DateRange;
    publicationSpecification: VO.PublicationSpecificationType;
  };

  private readonly pending: Array<ShareableLinkEventType> = [];

  private constructor(
    id: VO.ShareableLinkIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(
    id: VO.ShareableLinkIdType,
    events: ReadonlyArray<ShareableLinkEventType>,
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

    const event = bg.event(
      Events.ShareableLinkCreatedEvent,
      ShareableLink.getStream(id),
      {
        shareableLinkId: id,
        ownerId: requesterId,
        dateRangeStart: dateRange.getStart().ms,
        dateRangeEnd: dateRange.getEnd().ms,
        publicationSpecification,
        durationMs,
        createdAt: deps.Clock.now().ms,
      },
      deps,
    );

    shareableLink.record(event);

    return shareableLink;
  }

  expire() {
    Invariants.ShareableLinkIsActive.enforce({ status: this.status });
    Invariants.ShareableLinkExpirationTimePassed.enforce({
      durationMs: this.state?.durationMs,
      now: this.deps.Clock.now(),
      createdAt: this.state?.createdAt,
    });

    const event = bg.event(
      Events.ShareableLinkExpiredEvent,
      ShareableLink.getStream(this.id),
      { shareableLinkId: this.id },
      this.deps,
    );

    this.record(event);
  }

  revoke(requesterId: Auth.VO.UserIdType) {
    Invariants.ShareableLinkIsActive.enforce({ status: this.status });
    Invariants.RequesterOwnsShareableLink.enforce({ requesterId, ownerId: this.state?.ownerId });

    const event = bg.event(
      Events.ShareableLinkRevokedEvent,
      ShareableLink.getStream(this.id),
      { shareableLinkId: this.id },
      this.deps,
    );

    this.record(event);
  }

  isValid(publicationSpecification: VO.PublicationSpecificationType): boolean {
    return (
      Invariants.ShareableLinkIsActive.passes({ status: this.status }) &&
      publicationSpecification === this.state?.publicationSpecification
    );
  }

  isEmpty(): boolean {
    return this.state === undefined;
  }

  summarize() {
    const { shareableLink } = Invariants.ShareableLinkExists.enforce({ shareableLink: this.state });

    return {
      ownerId: shareableLink.ownerId,
      dateRange: shareableLink.dateRange,
      publicationSpecification: shareableLink.publicationSpecification,
      status: this.status,
    } as const;
  }

  pullEvents(): ReadonlyArray<ShareableLinkEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: ShareableLinkEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: ShareableLinkEventType): void {
    this.revision = new tools.Revision(event.revision ?? this.revision.next().value);

    switch (event.name) {
      case Events.SHAREABLE_LINK_CREATED_EVENT: {
        this.state = {
          ownerId: event.payload.ownerId,
          createdAt: event.payload.createdAt,
          durationMs: event.payload.durationMs,
          dateRange: new tools.DateRange(
            tools.Timestamp.fromValueSafe(event.payload.dateRangeStart),
            tools.Timestamp.fromValueSafe(event.payload.dateRangeEnd),
          ),
          publicationSpecification: event.payload.publicationSpecification,
        };
        this.status = VO.ShareableLinkStatusEnum.active;
        break;
      }

      case Events.SHAREABLE_LINK_EXPIRED_EVENT: {
        this.status = VO.ShareableLinkStatusEnum.expired;
        break;
      }

      case Events.SHAREABLE_LINK_REVOKED_EVENT: {
        this.status = VO.ShareableLinkStatusEnum.revoked;
        break;
      }
    }
  }

  static getStream(id: VO.ShareableLinkIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `shareable_link_${id}`);
  }
}
