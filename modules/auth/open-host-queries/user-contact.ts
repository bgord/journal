import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

type EmailContact = { type: "email"; address: tools.EmailType };

export interface UserContactOHQ {
  getPrimary(userId: Auth.VO.UserIdType): Promise<EmailContact | undefined>;
}
