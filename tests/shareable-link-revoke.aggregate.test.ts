import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.revoke", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      shareableLink.revoke(mocks.userId);

      expect(shareableLink.pullEvents()).toEqual([mocks.GenericShareableLinkRevokedEvent]);
      expect(() => shareableLink.revoke(mocks.userId)).toThrow(
        Publishing.Invariants.ShareableLinkIsActive.error,
      );
    });
  });

  test("ShareableLinkIsActive - already expired", async () => {
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

  test("ShareableLinkIsActive - already revoked", async () => {
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

  test("RequesterOwnsShareableLink", async () => {
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
});
