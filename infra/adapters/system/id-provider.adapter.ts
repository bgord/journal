import * as bg from "@bgord/bun";

export function createIdProvider(): bg.IdProviderPort {
  return new bg.IdProviderCryptoAdapter();
}
