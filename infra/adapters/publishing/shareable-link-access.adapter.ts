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

    if (shareableLink.isEmpty()) return { valid: false };

    const valid = shareableLink.isValid(publicationSpecification);
    const summary = shareableLink.summarize();

    const reason = valid
      ? "active"
      : summary.status === "expired"
        ? "expired"
        : summary.status === "revoked"
          ? "revoked"
          : "wrong_specification_publication";

    await this.auditor.record({
      linkId: id,
      ownerId: summary.ownerId,
      publicationSpecification,
      validity: valid ? Publishing.VO.AccessValidity.accepted : Publishing.VO.AccessValidity.rejected,
      reason,
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
