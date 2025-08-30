import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/shared/entries/${mocks.shareableLinkId}`;

describe(`GET ${url}`, () => {
  test("validation - incorrect id", async () => {
    const response = await server.request(
      "/shared/entries/id",
      { method: "GET", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - expired", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        { method: "GET", headers: mocks.correlationIdAndRevisionHeaders() },
        mocks.ip,
      );

      expect(response.status).toBe(403);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedExpiredEvent]);
    });
  });

  test("validation - revoked", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        { method: "GET", headers: mocks.correlationIdAndRevisionHeaders() },
        mocks.ip,
      );
      expect(response.status).toBe(403);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedRevokedEvent]);
    });
  });

  test("happy path", async () => {
    spyOn(Adapters.Emotions.EntriesSharing, "listForOwnerInRange").mockResolvedValue([]);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        { method: "GET", headers: mocks.correlationIdAndRevisionHeaders() },
        mocks.ip,
      );
      expect(response.status).toBe(200);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedAcceptedEvent]);
    });
  });
});
