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

  private static isValid(raw: string): boolean {
    return /^[a-z]{2}$/i.test(raw);
  }

  static create(raw: string): LanguageTag {
    const normalized = raw.trim().toLowerCase();

    if (!LanguageTag.isValid(normalized)) throw new InvalidLanguageTagError();

    return new LanguageTag(normalized);
  }

  equals(other: LanguageTag): boolean {
    return this.tag === other.tag;
  }

  toString(): string {
    return this.tag;
  }

  toJSON(): string {
    return this.tag;
  }
}
