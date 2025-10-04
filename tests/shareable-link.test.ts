import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

describe("ShareableLink", () => {
  test("build new aggregate", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [], deps);
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("isEmpty - true", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [], deps);
    expect(shareableLink.isEmpty()).toEqual(true);
  });

  test("isEmpty - true", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );
    expect(shareableLink.isEmpty()).toEqual(false);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

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
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Clock, "nowMs").mockReturnValueOnce(tools.Time.Now(mocks.T0).Add(tools.Time.Hours(1)).ms);
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
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(async () => shareableLink.expire()).toThrow(Publishing.Invariants.ShareableLinkIsActive.error);

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("expire - ShareableLinkExpirationTimePassed", async () => {
    // Link created at T0, duration 1s, should not be expired at T0 - 1 hour
    spyOn(Adapters.Clock, "nowMs").mockReturnValueOnce(
      tools.Time.Now(mocks.T0).Minus(tools.Time.Hours(1)).ms,
    );

    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(async () => shareableLink.expire()).toThrow(
      Publishing.Invariants.ShareableLinkExpirationTimePassed.error,
    );

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
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
      mocks.alarmId,
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
      mocks.alarmId,
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
      mocks.alarmId,
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
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(true);
  });

  test("isValid - false - expired", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(false);
  });

  test("isValid - false - revoked", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.isValid("entries")).toEqual(false);
  });

  test("isValid - false - specification", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.alarmId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkRevokedEvent],
      deps,
    );

    expect(shareableLink.isValid("other")).toEqual(false);
  });
});
