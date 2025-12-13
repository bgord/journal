import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("ShareableLinksExpirer", async () => {
  const di = await bootstrap(mocks.Env);

  const policy = new Publishing.Policies.ShareableLinksExpirer({
    ...di.Adapters.System,
    ExpiringShareableLinks: di.Adapters.Publishing.ExpiringShareableLinks,
  });

  test("validation - ShareableLinkIsActive - already revoked", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([mocks.shareableLink]);
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - ShareableLinkIsActive - already expired", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([mocks.shareableLink]);
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - ShareableLinkExpirationTimePassed", async () => {
    // Link created at T0, duration 1s, should not be expired at T0 - 1 hour
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.System.Clock, "nowMs").mockReturnValue(mocks.T0.subtract(tools.Duration.Hours(1)).ms);
    spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([mocks.shareableLink]);
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("repository failure", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockRejectedValue(new Error("FAILURE"));
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no links", async () => {
    spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    // Link created at T0, duration 1s, should be expired at T0 + 1 hour
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([mocks.shareableLink]);
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(mocks.T0.add(tools.Duration.Hours(1)));
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkExpiredEvent]);
  });
});
