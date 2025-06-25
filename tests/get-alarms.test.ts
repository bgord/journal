import { describe, expect, test } from "bun:test";
import { server } from "../server";
import * as mocks from "./mocks";

describe("GET /alarms/get", () => {
  test("validation - empty payload", async () => {
    const response = await server.request("/alarms/get", { method: "GET" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([]);
  });
});
