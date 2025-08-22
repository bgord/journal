import type { LanguageTag } from "./language-tag";

export class UnsupportedLanguageError extends Error {
  constructor(code?: string) {
    super(`unsupported_language${code ? `: ${code}` : ""}`);
    Object.setPrototypeOf(this, UnsupportedLanguageError.prototype);
  }
}

export class SupportedLanguagesSet<L extends readonly string[]> {
  private readonly index: Set<string>;

  constructor(private readonly allowed: L) {
    this.index = new Set(allowed.map((x) => x.toString()));
    Object.freeze(this);
  }

  list(): L {
    return this.allowed;
  }
  ensure(tag: LanguageTag): L[number] {
    const code = tag.toString();

    if (!this.index.has(code)) throw new UnsupportedLanguageError(code);

    return code as L[number];
  }
}
