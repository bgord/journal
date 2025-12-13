import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("ShareableLinkAccess", async () => {
  const di = await bootstrap(mocks.Env);
  registerEventHandlers(di);
  registerCommandHandlers(di);

  test("true", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = (
        await di.Adapters.Publishing.ShareableLinkAccess.check(
          mocks.shareableLinkId,
          mocks.publicationSpecification,
          mocks.accessContext,
        )
      ).valid;
      expect(result).toEqual(true);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedAcceptedEvent]);
  });

  test("false - not found", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await di.Adapters.Publishing.ShareableLinkAccess.check(
          mocks.shareableLinkId,
          mocks.publicationSpecification,
          mocks.accessContext,
        ),
      ).toEqual({
        valid: false,
      });
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("isValid - false - expired", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await di.Adapters.Publishing.ShareableLinkAccess.check(
          mocks.shareableLinkId,
          mocks.publicationSpecification,
          mocks.accessContext,
        ),
      ).toEqual({
        valid: false,
      });
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedExpiredEvent]);
  });

  test("isValid - false - revoked", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await di.Adapters.Publishing.ShareableLinkAccess.check(
          mocks.shareableLinkId,
          mocks.publicationSpecification,
          mocks.accessContext,
        ),
      ).toEqual({
        valid: false,
      });
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedRevokedEvent]);
  });

  test("isValid - false - specification", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await di.Adapters.Publishing.ShareableLinkAccess.check(
          mocks.shareableLinkId,
          mocks.anotherPublicationSpecification,
          mocks.accessContext,
        ),
      ).toEqual({
        valid: false,
      });
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedWrongSpecEvent]);
  });
});
