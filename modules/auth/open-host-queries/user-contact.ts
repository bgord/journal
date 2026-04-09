import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export type EmailContact = { type: "email"; address: tools.EmailType };

export interface UserContactOHQ {
  getPrimary(userId: Auth.VO.UserIdType): Promise<EmailContact | undefined>;
}
