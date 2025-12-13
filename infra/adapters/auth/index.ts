import { UserContact } from "./user-contact.adapter";
import { UserDirectory } from "./user-directory.adapter";

export function createAuthAdapters() {
  return { UserContact, UserDirectory };
}
