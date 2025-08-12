export interface BucketCounter {
  /** Returns counts for keys. Missing keys default to 0. */
  getMany(keys: string[]): Promise<Record<string, number>>;
}
