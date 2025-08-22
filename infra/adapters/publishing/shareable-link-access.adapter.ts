import * as Publishing from "+publishing";
import { ShareableLinkAccessAuditor } from "./shareable-link-access-auditor.adapter";
import { ShareableLinkRepository } from "./shareable-link-repository.adapter";

export const ShareableLinkAccess = new Publishing.OHQ.ShareableLinkAccessAdapter(
  ShareableLinkRepository,
  ShareableLinkAccessAuditor,
);
