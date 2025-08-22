export class InvalidLanguageTagError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidLanguageTagError.prototype);
  }
}

export class LanguageTag {
  constructor(private readonly tag: string) {
    Object.freeze(this);
  }

  static create(raw: string): LanguageTag {
    const candidate = raw.trim().toLowerCase();

    if (!/^[a-z]{2}$/i.test(candidate)) throw new InvalidLanguageTagError();

    return new LanguageTag(candidate);
  }

  equals(other: LanguageTag): boolean {
    return this.tag === other.tag;
  }

  toString() {
    return this.tag;
  }
}
