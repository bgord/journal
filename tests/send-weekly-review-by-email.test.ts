import { describe, expect, test, spyOn } from "bun:test";
import * as bg from "@bgord/bun";
import { server } from "../server";
import * as mocks from "./mocks";
import { auth } from "../infra/auth";

const url = `/weekly-review/${mocks.weeklyReviewId}/send-by-email`;

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toBe(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request("/weekly-review/id/send-by-email", { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });
});
