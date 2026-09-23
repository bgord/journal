import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLink.expire", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
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

  test("ShareableLinkIsActive", async () => {
    const shareableLink = Publishing.Aggregates.ShareableLink.build(
      mocks.shareableLinkId,
      [mocks.GenericShareableLinkCreatedEvent, mocks.GenericShareableLinkExpiredEvent],
      deps,
    );

    expect(async () => shareableLink.expire()).toThrow(Publishing.Invariants.ShareableLinkIsActive.error);
    expect(shareableLink.pullEvents()).toEqual([]);
  });

  test("ShareableLinkExpirationTimePassed", async () => {
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
});
