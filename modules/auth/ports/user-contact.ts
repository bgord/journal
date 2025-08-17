import * as VO from "+auth/value-objects";

export type EmailContact = { email: string };

export interface UserContactPort {
  getPrimaryEmail(userId: VO.UserIdType): Promise<EmailContact | undefined>;
}
