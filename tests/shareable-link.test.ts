import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("build new aggregate", () => {
    expect(Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [], deps).pullEvents()).toEqual(
      [],
    );
  });

  test("isEmpty - true", () => {
    expect(Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [], deps).isEmpty()).toEqual(
      true,
    );
  });

  test("isEmpty - true", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.isEmpty()).toEqual(false);
  });

  test("generate - correct path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const shareableLink = Publishing.Aggregates.ShareableLink.create(
        mocks.shareableLinkId,
        mocks.publicationSpecification,
        mocks.dateRange,
        mocks.durationMs,
        mocks.userId,
        deps,
      );

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkCreatedEvent]);
    });
  });

  test("expire - correct path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(mocks.T0.add(tools.Duration.Hours(1))),
    );
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      shareableLink.expire();

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkExpiredEvent]);
    });
  });

  test("expire - ShareableLinkIsActive", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(async () => shareableLink.expire()).toThrow(Publishing.Invariants.ShareableLinkIsActive.error);
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("expire - ShareableLinkExpirationTimePassed", async () => {
    // Link created at T0, duration 1s, should not be expired at T0 - 1 hour
    using _ = spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(
      mocks.T0.subtract(tools.Duration.Hours(1)),
    );
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(async () => shareableLink.expire()).toThrow(
      Publishing.Invariants.ShareableLinkExpirationTimePassed.error,
    );
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - correct path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      shareableLink.revoke(mocks.userId);

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkRevokedEvent]);
    });
  });

  test("revoke - ShareableLinkIsActive - already revoked", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(async () => shareableLink.revoke(mocks.userId)).toThrow(
      Publishing.Invariants.ShareableLinkIsActive.error,
    );
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - ShareableLinkIsActive - already expired", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(async () => shareableLink.revoke(mocks.userId)).toThrow(
      Publishing.Invariants.ShareableLinkIsActive.error,
    );
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - RequesterOwnsShareableLink", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(async () => shareableLink.revoke(mocks.anotherUserId)).toThrow(
      Publishing.Invariants.RequesterOwnsShareableLink.error,
    );
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("isValid - true", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(true);
  });

  test("isValid - false - expired", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(false);
  });

  test("isValid - false - revoked", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(false);
  });

  test("isValid - false - specification", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.isValid("other")).toEqual(false);
  });
});
