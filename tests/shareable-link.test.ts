import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "../modules/publishing";
import * as mocks from "./mocks";

describe("Publishing", () => {
  test("build new aggregate", () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, []);

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("generate - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Date, "now").mockReturnValue(mocks.shareableLinkCreatedAt);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const shareableLink = Publishing.Aggregates.ShareableLink.create(
        mocks.shareableLinkId,
        mocks.publicationSpecification,
        mocks.dateRange,
        mocks.duration,
        mocks.userId,
      );

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkCreatedEvent]);
    });
  });

  test("expire - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [
      mocks.GenericShareableLinkCreatedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      shareableLink.expire();
      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkExpiredEvent]);
    });
  });

  test("expire - ShareableLinkIsActive", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);

    expect(async () => shareableLink.expire()).toThrow(Publishing.Policies.ShareableLinkIsActive.error);

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("expire - ShareableLinkExpirationTimePassed", async () => {
    spyOn(Date, "now").mockReturnValue(Date.now() + mocks.duration.ms + 1);
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [
      mocks.GenericShareableLinkCreatedEvent,
    ]);

    expect(async () => shareableLink.expire()).toThrow(
      Publishing.Policies.ShareableLinkExpirationTimePassed.error,
    );

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.shareableLinkId, [
      mocks.GenericShareableLinkCreatedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      shareableLink.revoke(mocks.userId);
      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkRevokedEvent]);
    });
  });

  test("revoke - ShareableLinkIsActive - already revoked", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);

    expect(async () => shareableLink.revoke(mocks.userId)).toThrow(
      Publishing.Policies.ShareableLinkIsActive.error,
    );

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - ShareableLinkIsActive - already expired", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);

    expect(async () => shareableLink.revoke(mocks.userId)).toThrow(
      Publishing.Policies.ShareableLinkIsActive.error,
    );

    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("revoke - RequesterOwnsShareableLink", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(mocks.alarmId, [
      mocks.GenericShareableLinkCreatedEvent,
    ]);

    expect(async () => shareableLink.revoke(mocks.anotherUserId)).toThrow(
      Publishing.Policies.RequesterOwnsShareableLink.error,
    );

    expect(shareableLink.pullEvents()).toEqual([]);
  });
});
