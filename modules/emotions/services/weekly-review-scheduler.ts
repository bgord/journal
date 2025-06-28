export class WeeklyReviewScheduler {
  // Sunday at 18:00 UTC
  static cron = "0 18 * * 0";

  /** @public */
  static label = "WeeklyReviewScheduler";

  /** @public */
  static async process() {}
}
