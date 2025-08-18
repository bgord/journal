import * as Publishing from "+publishing";
import { ShareableLinkRepositoryAdapter } from "./shareable-link-repository.adapter";

class ShareableLinkAccessBg implements Publishing.OHQ.ShareableLinkAccessPort {
  constructor(private readonly repo: Publishing.Ports.ShareableLinkRepositoryPort) {}

  async check(
    id: Publishing.VO.ShareableLinkIdType,
    publicationSpecification: Publishing.VO.PublicationSpecificationType,
  ): Promise<Publishing.OHQ.ShareableLinkAccessValidType | Publishing.OHQ.ShareableLinkAccessInvalidType> {
    const shareableLink = await this.repo.load(id);

    const valid = shareableLink.isValid(publicationSpecification);

    if (!valid) return { valid: false };

    return { valid: true, details: shareableLink.summarize() };
  }
}

export const ShareableLinkAccess = new ShareableLinkAccessBg(ShareableLinkRepositoryAdapter);
