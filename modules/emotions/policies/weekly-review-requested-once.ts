import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as Emotions from "../";

class WeeklyReviewRequestedOnceError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, WeeklyReviewRequestedOnceError.prototype);
  }
}

type WeeklyReviewRequestedOnceConfigType = {
  status: Emotions.VO.WeeklyReviewStatusEnum;
};

class WeeklyReviewRequestedOnceFactory extends bg.Policy<WeeklyReviewRequestedOnceConfigType> {
  fails(config: WeeklyReviewRequestedOnceConfigType) {
    return config.status !== Emotions.VO.WeeklyReviewStatusEnum.initial;
  }

  message = "alarm.generated.once";

  error = WeeklyReviewRequestedOnceError;

  code = 403 as ContentfulStatusCode;
}

export const WeeklyReviewRequestedOnce = new WeeklyReviewRequestedOnceFactory();
