import type { LanguageTag } from "./language-tag";

export class UnsupportedLanguageError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UnsupportedLanguageError.prototype);
  }
}

export class SupportedLanguages<L extends readonly string[]> {
  constructor(private readonly allowed: L) {}

  list(): L {
    return this.allowed;
  }

  isSupported(value: string): value is L[number] {
    return (this.allowed as readonly string[]).includes(value);
  }

  ensure(value: LanguageTag): L[number] {
    const candidate = value.toString();
    if (!this.isSupported(candidate)) throw new UnsupportedLanguageError();

    return candidate as L[number];
  }
}
