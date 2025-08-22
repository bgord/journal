import type { LanguageTag } from "./language-tag";

export class UnsupportedLanguageError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UnsupportedLanguageError.prototype);
  }
}

export class SupportedLanguagesSet<L extends readonly string[]> {
  private readonly index: Set<string>;

  constructor(allowed: L) {
    this.index = new Set(allowed.map((x) => x.toString()));
    Object.freeze(this);
  }

  ensure(tag: LanguageTag): L[number] {
    const code = tag.toString();

    if (!this.index.has(code)) throw new UnsupportedLanguageError();

    return code as L[number];
  }
}
