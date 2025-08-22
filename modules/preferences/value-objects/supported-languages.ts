import * as tools from "@bgord/tools";

export class UnsupportedLanguageError extends Error {
  constructor(public readonly language: string) {
    super(`unsupported_language: ${language}`);
    Object.setPrototypeOf(this, UnsupportedLanguageError.prototype);
  }
}

export class SupportedLanguagesVO<L extends readonly string[]> {
  constructor(private readonly allowed: L) {}

  list(): L {
    return this.allowed;
  }

  isSupported(value: string): value is L[number] {
    return (this.allowed as readonly string[]).includes(value);
  }

  ensure(value: string): L[number] {
    const parsed = tools.Language.parse(value);

    if (!this.isSupported(parsed)) throw new UnsupportedLanguageError(parsed);

    return parsed as L[number];
  }
}
