import { expect } from "bun:test";
import type * as bg from "@bgord/bun";

export async function assertInvariantError(response: Response, policy: bg.Invariant<any>) {
  const json = await response.json();

  expect(response.status).toEqual(policy.code);
  expect(json).toEqual({ message: policy.message, _known: true });
}
