import type { SupportedLanguages } from "+languages";

export interface UserLanguagePort {
  get(userId: string): Promise<SupportedLanguages | null>;
}
