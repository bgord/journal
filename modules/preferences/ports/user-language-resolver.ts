export interface UserLanguageResolverPort {
  resolve(input: { stored: string | null }): string | Promise<string>;
}
