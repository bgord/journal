import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { createEnvironmentLoader } from "+infra/env";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/weekly-review/${mocks.weeklyReviewId}/export/email`;

describe(`POST ${url}`, async () => {
  const EnvironmentLoader = createEnvironmentLoader();
  const di = await bootstrap(await EnvironmentLoader.load());
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/weekly-review/id/export/email", { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(null);

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewExists);
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockRejectedValue(new Error("Failure"));

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReviewSkipped);

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewIsCompleted);
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview);

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsWeeklyReview);
  });

  test("happy path", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
