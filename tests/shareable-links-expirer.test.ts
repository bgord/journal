import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("ShareableLinksExpirer", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const policy = new Publishing.Policies.ShareableLinksExpirer({
    ...di.Adapters.System,
    ...di.Tools,
    ExpiringShareableLinks: di.Adapters.Publishing.ExpiringShareableLinks,
  });

  test("validation - ShareableLinkIsActive - already revoked", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([
        mocks.shareableLink,
      ]),
    );
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericShareableLinkCreatedEvent,
        mocks.GenericShareableLinkRevokedEvent,
      ]),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - ShareableLinkIsActive - already expired", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([
        mocks.shareableLink,
      ]),
    );
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([
        mocks.GenericShareableLinkCreatedEvent,
        mocks.GenericShareableLinkExpiredEvent,
      ]),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("validation - ShareableLinkExpirationTimePassed", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    // Link created at T0, duration 1s, should not be expired at T0 - 1 hour
    spies.use(
      spyOn(di.Adapters.System.Clock, "now").mockReturnValue(mocks.T0.subtract(tools.Duration.Hours(1))),
    );
    spies.use(
      spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([
        mocks.shareableLink,
      ]),
    );
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("repository failure", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockImplementation(
        mocks.throwIntentionalErrorAsync,
      ),
    );
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no links", async () => {
    using _ = spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    // Link created at T0, duration 1s, should be expired at T0 + 1 hour
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Publishing.ExpiringShareableLinks, "listDue").mockResolvedValue([
        mocks.shareableLink,
      ]),
    );
    spies.use(spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]));
    spies.use(
      spyOn(di.Adapters.System.Clock, "now")
        .mockReturnValueOnce(mocks.T0)
        .mockReturnValueOnce(mocks.T0.add(tools.Duration.Hours(1))),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkExpiredEvent]);
  });
});
