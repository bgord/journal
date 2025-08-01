import { expect } from "bun:test";
import * as bg from "@bgord/bun";

export async function assertPolicyError(response: Response, policy: bg.Policy<any>) {
  const json = await response.json();

  expect(response.status).toBe(policy.code);
  expect(json).toEqual({ message: policy.message, _known: true });
}
