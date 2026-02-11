import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/weekly-review/${mocks.weeklyReviewId}/export/email`;

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    using _ = spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request("/api/weekly-review/id/export/email", { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - WeeklyReviewExists - no weekly review", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(null));

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertInvariantError(response, 404, "weekly.review.exists.error");
  });

  test("validation - WeeklyReviewExists - repo failure", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockImplementation(
        mocks.throwIntentionalErrorAsync,
      ),
    );

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("validation - WeeklyReviewIsCompleted", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(
        mocks.weeklyReviewSkipped,
      ),
    );

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertInvariantError(response, 400, "weekly.review.is.completed.error");
  });

  test("validation - RequesterOwnsWeeklyReview", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.anotherAuth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview),
    );

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    await testcases.assertInvariantError(response, 403, "requester.owns.weekly.review.error");
  });

  test("happy path", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    using spies = new DisposableStack();
    spies.use(spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth));
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview),
    );
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    const response = await server.request(
      url,
      { method: "POST", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
