import { createUserContact } from "./user-contact.adapter";
import { createUserDirectory } from "./user-directory.adapter";

export function createAuthAdapters() {
  return { UserContact: createUserContact(), UserDirectory: createUserDirectory() };
}
