import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  Clock: bg.ClockPort;
  FileReaderJson: bg.FileReaderJsonPort;
  HashContent: bg.HashContentStrategy;
};

export function createTranslationsProvider(
  Env: EnvironmentResultType,
  deps: Dependencies,
): bg.TranslationsProviderPort {
  const CacheRepository = new bg.CacheRepositoryInMemoryAdapter(
    {
      type: "finite",
      ttl: tools.Duration.Minutes(10),
    },
    deps,
  );
  const CacheResolver = new bg.CacheResolverReadThroughStrategy({ CacheRepository });
  const adapter = new bg.TranslationsProviderJsonAdapter(deps);

  return {
    [bg.NodeEnvironmentEnum.local]: adapter,
    [bg.NodeEnvironmentEnum.test]: adapter,
    [bg.NodeEnvironmentEnum.staging]: adapter,
    [bg.NodeEnvironmentEnum.production]: new bg.TranslationsProviderWithCacheAdapter(
      {
        id: "translations",
        inner: adapter,
      },
      { CacheResolver, ...deps },
    ),
  }[Env.type];
}
