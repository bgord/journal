import type * as tools from "@bgord/tools";
import type { PublicationSpecificationType } from "./publication-specification";
import type { ShareableLinkIdType } from "./shareable-link-id";
import type { ShareableLinkStatusEnum } from "./shareable-link-status";

export type ShareableLinkSnapshot = {
  id: ShareableLinkIdType;
  status: ShareableLinkStatusEnum;
  publicationSpecification: PublicationSpecificationType;
  dateRangeStart: tools.TimestampType;
  dateRangeEnd: tools.TimestampType;
  expiresAt: tools.TimestampType;
  updatedAt: tools.TimestampType;
  revision: tools.RevisionValueType;
};
