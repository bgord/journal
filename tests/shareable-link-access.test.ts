import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

describe("ShareableLinkAccess", () => {
  test("true", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = (
        await Adapters.Publishing.ShareableLinkAccess.check(
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
    spyOn(EventStore, "find").mockResolvedValue([]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await Adapters.Publishing.ShareableLinkAccess.check(
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
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await Adapters.Publishing.ShareableLinkAccess.check(
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
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await Adapters.Publishing.ShareableLinkAccess.check(
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
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        await Adapters.Publishing.ShareableLinkAccess.check(
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
