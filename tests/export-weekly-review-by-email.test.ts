import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { auth } from "../infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/weekly-review/${mocks.weeklyReviewId}/export/email`;

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request("/weekly-review/id/export/email", { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(undefined);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewExists);
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockImplementation(() => {
      throw new Error("Failure");
    });
    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toBe(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReviewSkipped);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.WeeklyReviewIsCompleted);
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    await testcases.assertInvariantError(response, Emotions.Invariants.RequesterOwnsWeeklyReview);
  });

  test("happy path", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewExportId);

    const response = await server.request(
      url,
      { method: "POST", headers: new Headers({ "x-correlation-id": mocks.correlationId }) },
      mocks.ip,
    );

    expect(response.status).toBe(200);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
