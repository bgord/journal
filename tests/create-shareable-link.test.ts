import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { auth } from "../infra/auth";
import { EventStore } from "../infra/event-store";
import * as Publishing from "../modules/publishing";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/publishing/link/create";

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    expect(response.status).toBe(400);
  });

  test("validation - publicationSpecification", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ publicationSpecification: 1 }) },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: Publishing.VO.PublicationSpecificationErrors.invalid, _known: true });
  });

  test("validation - durationMs", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      { method: "POST", body: JSON.stringify({ publicationSpecification: "entries", durationMs: "ok" }) },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - dateRangeStart", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({ publicationSpecification: "entries", durationMs: 1000, dateRangeStart: "ok" }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - dateRangeEnd", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: 0,
          dateRangeEnd: "ok",
        }),
      },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - dateRange", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: 10,
          dateRangeEnd: 0,
        }),
      },
      mocks.ip,
    );
    expect(response.status).toBe(500);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.shareableLinkId);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          publicationSpecification: "entries",
          durationMs: 1000,
          dateRangeStart: 0,
          dateRangeEnd: 1000,
        }),
        headers: new Headers({ "x-correlation-id": mocks.correlationId }),
      },
      mocks.ip,
    );
    expect(response.status).toBe(200);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkCreatedEvent]);
  });
});
