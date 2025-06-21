import * as bg from "@bgord/bun";
import Emittery from "emittery";
import * as Events from "../modules/emotions/events";
import { logger } from "./logger";

const EventLogger = new bg.EventLogger(logger);

export const EventBus = new Emittery<{
  EMOTION_JOURNAL_ENTRY_DELETED: Events.EmotionJournalEntryDeletedEventType;
  EMOTION_LOGGED_EVENT: Events.EmotionJournalEntryDeletedEventType;
  EMOTION_REAPPRAISED_EVENT: Events.EmotionReappraisedEventType;
  MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT: Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType;
  MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT: Events.MultipleMaladaptiveReactionsPatternDetectedEventType;
  POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT: Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType;
  REACTION_EVALUATED_EVENT: Events.ReactionEvaluatedEventType;
  REACTION_LOGGED_EVENT: Events.ReactionLoggedEventType;
  SITUATION_LOGGED_EVENT: Events.SituationLoggedEventType;
}>({
  debug: { enabled: true, name: "infra/logger", logger: EventLogger.handle },
});
