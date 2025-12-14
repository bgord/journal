import { UserContactOHQ } from "./user-contact.adapter";
import { UserDirectoryOHQ } from "./user-directory.adapter";

export function createAuthAdapters() {
  return { UserContactOHQ, UserDirectoryOHQ };
}
