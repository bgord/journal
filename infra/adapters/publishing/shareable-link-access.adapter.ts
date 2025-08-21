import * as Publishing from "+publishing";
import { ShareableLinkAccessAuditor } from "./shareable-link-access-auditor.adapter";
import { ShareableLinkRepositoryAdapter } from "./shareable-link-repository.adapter";

class ShareableLinkAccessBg implements Publishing.OHQ.ShareableLinkAccessPort {
  constructor(
    private readonly repo: Publishing.Ports.ShareableLinkRepositoryPort,
    private readonly auditor: Publishing.Ports.ShareableLinkAccessAuditorPort,
  ) {}

  async check(
    id: Publishing.VO.ShareableLinkIdType,
    publicationSpecification: Publishing.VO.PublicationSpecificationType,
    context: Publishing.VO.AccessContext,
  ): Promise<Publishing.OHQ.ShareableLinkAccessValidType | Publishing.OHQ.ShareableLinkAccessInvalidType> {
    const shareableLink = await this.repo.load(id);

    const valid = shareableLink.isValid(publicationSpecification);
    const summary = shareableLink.summarize();

    await this.auditor.record({
      linkId: id,
      ownerId: summary.ownerId,
      publicationSpecification,
      validity: valid ? Publishing.VO.AccessValidity.accepted : Publishing.VO.AccessValidity.rejected,
      reason: summary.status ?? "unknown",
      context,
    });

    if (!valid) return { valid: false };

    return { valid: true, details: shareableLink.summarize() };
  }
}

export const ShareableLinkAccess = new ShareableLinkAccessBg(
  ShareableLinkRepositoryAdapter,
  ShareableLinkAccessAuditor,
);
