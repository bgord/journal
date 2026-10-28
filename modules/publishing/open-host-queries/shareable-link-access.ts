import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Publishing from "+publishing";
import { AccessValidity } from "../value-objects/access-validity";
import { ShareableLinkAccessReason } from "../value-objects/shareable-link-access-reason";

export type ShareableLinkAccessValidType = {
  valid: true;
  details: {
    ownerId: Auth.VO.UserIdType;
    publicationSpecification: Publishing.VO.PublicationSpecificationType;
    dateRange: tools.DateRange;
  };
};

export type ShareableLinkAccessInvalidType = { valid: false };

export interface ShareableLinkAccessPort {
  check(
    id: Publishing.VO.ShareableLinkIdType,
    publicationSpecification: Publishing.VO.PublicationSpecificationType,
    context: Publishing.VO.AccessContext,
  ): Promise<ShareableLinkAccessValidType | ShareableLinkAccessInvalidType>;
}

export class ShareableLinkAccessAdapter implements Publishing.OHQ.ShareableLinkAccessPort {
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

    const reason = shareableLink.access(publicationSpecification);
    const valid = reason === ShareableLinkAccessReason.active;
    const summary = shareableLink.summarize();

    await this.auditor.record({
      linkId: id,
      ownerId: summary.ownerId,
      publicationSpecification,
      validity: valid ? AccessValidity.accepted : AccessValidity.rejected,
      reason,
      context,
    });

    if (!valid) return { valid: false };

    return { valid: true, details: summary };
  }
}
