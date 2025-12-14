import * as Publishing from "+publishing";

type Dependencies = {
  ShareableLinkAccessAuditor: Publishing.Ports.ShareableLinkAccessAuditorAdapter;
  ShareableLinkRepository: Publishing.Ports.ShareableLinkRepositoryPort;
};

export function createShareableLinkAccessOHQ(deps: Dependencies): Publishing.OHQ.ShareableLinkAccessAdapter {
  return new Publishing.OHQ.ShareableLinkAccessAdapter(
    deps.ShareableLinkRepository,
    deps.ShareableLinkAccessAuditor,
  );
}
