import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = `/api/shared/entries/${mocks.shareableLinkId}`;

describe(`GET ${url}`, async () => {
  const di = await bootstrap(mocks.Env);
  const server = createServer(di);

  test("validation - incorrect id", async () => {
    const response = await server.request(
      "/api/shared/entries/id",
      { method: "GET", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - expired", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        { method: "GET", headers: mocks.correlationIdAndRevisionHeaders() },
        mocks.ip,
      );

      expect(response.status).toEqual(403);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedExpiredEvent]);
    });
  });

  test("validation - revoked", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        { method: "GET", headers: mocks.correlationIdAndRevisionHeaders() },
        mocks.ip,
      );
      expect(response.status).toEqual(403);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedRevokedEvent]);
    });
  });

  test("happy path", async () => {
    spyOn(di.Adapters.Emotions.EntriesSharingOHQ, "listForOwnerInRange").mockResolvedValue([]);
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        { method: "GET", headers: mocks.correlationIdAndRevisionHeaders() },
        mocks.ip,
      );
      expect(response.status).toEqual(200);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedAcceptedEvent]);
    });
  });
});
