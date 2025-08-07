import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { auth } from "../infra/auth";
import { EventStore } from "../infra/event-store";
import * as Publishing from "../modules/publishing";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/shared/entries/${mocks.shareableLinkId}`;

describe(`GET ${url}`, () => {
  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      "/shared/entries/id",
      { method: "GET", headers: mocks.revisionHeaders() },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });
});
