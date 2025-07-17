# journal

[Check status](https://bgord.github.io/statuses/history/journal)

## Configuration:

Clone the repository

```
git clone git@github.com:bgord/journal.git --recurse-submodules
```

Install packages

```
bun i
```

Create env files

```
cp .env.example .env.local
cp .env.example .env.test
```

Start the app

```
./bgord-scripts/local-server-start.sh
```

Run the tests

```
./bgord-scripts/test-run.sh
```

## Domain:

```
modules/
├── auth
│   ├── repositories
│   │   └── user-repository.ts
│   └── value-objects
│       ├── password.ts
│       └── user-id.ts
└── emotions
    ├── aggregates
    │   ├── alarm.ts
    │   ├── entry.ts
    │   └── weekly-review.ts
    ├── command-handlers
    │   ├── handleCancelAlarmCommand.ts
    │   ├── handleCompleteWeeklyReviewCommand.ts
    │   ├── handleDeleteEntryCommand.ts
    │   ├── handleEvaluateReactionCommand.ts
    │   ├── handleGenerateAlarmCommand.ts
    │   ├── handleLogEntryCommand.ts
    │   ├── handleMarkWeeklyReviewAsFailedCommand.ts
    │   ├── handleReappraiseEmotionCommand.ts
    │   ├── handleRequestWeeklyReviewCommand.ts
    │   ├── handleSaveAlarmAdviceCommand.ts
    │   ├── handleSendAlarmNotificationCommand.ts
    ├── commands
    │   ├── CANCEL_ALARM_COMMAND.ts
    │   ├── COMPLETE_WEEKLY_REVIEW_COMMAND.ts
    │   ├── DELETE_ENTRY_COMMAND.ts
    │   ├── EVALUATE_REACTION_COMMAND.ts
    │   ├── GENERATE_ALARM_COMMAND.ts
    │   ├── LOG_ENTRY_COMMAND.ts
    │   ├── MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND.ts
    │   ├── REAPPRAISE_EMOTION_COMMAND.ts
    │   ├── REQUEST_WEEKLY_REVIEW_COMMAND.ts
    │   ├── SAVE_ALARM_ADVICE_COMMAND.ts
    │   ├── SEND_ALARM_NOTIFICATION_COMMAND.ts
    ├── entities
    │   ├── emotion.ts
    │   ├── reaction.ts
    │   └── situation.ts
    ├── event-handlers
    │   ├── onAlarmAdviceSavedEvent.ts
    │   ├── onAlarmCancelledEvent.ts
    │   ├── onAlarmGeneratedEvent.ts
    │   ├── onAlarmNotificationSentEvent.ts
    │   ├── onEmotionLoggedEvent.ts
    │   ├── onEmotionReappraisedEvent.ts
    │   ├── onEntryDeletedEvent.ts
    │   ├── onLowCopingEffectivenessPatternDetectedEvent.ts
    │   ├── onMoreNegativeThanPositiveEmotionsPatternDetectedEvent.ts
    │   ├── onMultipleMaladaptiveReactionsPatternDetectedEvent.ts
    │   ├── onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent.ts
    │   ├── onReactionEvaluatedEvent.ts
    │   ├── onReactionLoggedEvent.ts
    │   └── onSituationLoggedEvent.ts
    ├── events
    │   ├── ALARM_ADVICE_SAVED_EVENT.ts
    │   ├── ALARM_CANCELLED_EVENT.ts
    │   ├── ALARM_GENERATED_EVENT.ts
    │   ├── ALARM_NOTIFICATION_SENT_EVENT.ts
    │   ├── EMOTION_LOGGED_EVENT.ts
    │   ├── EMOTION_REAPPRAISED_EVENT.ts
    │   ├── ENTRY_DELETED_EVENT.ts
    │   ├── LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT.ts
    │   ├── MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT.ts
    │   ├── MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT.ts
    │   ├── POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT.ts
    │   ├── REACTION_EVALUATED_EVENT.ts
    │   ├── REACTION_LOGGED_EVENT.ts
    │   ├── SITUATION_LOGGED_EVENT.ts
    │   ├── WEEKLY_REVIEW_COMPLETED_EVENT.ts
    │   ├── WEEKLY_REVIEW_FAILED_EVENT.ts
    │   ├── WEEKLY_REVIEW_REQUESTED_EVENT.ts
    │   ├── WEEKLY_REVIEW_SKIPPED_EVENT.ts
    ├── policies
    │   ├── alarm-advice-available.ts
    │   ├── alarm-already-generated.ts
    │   ├── alarm-generated-once.ts
    │   ├── alarm-is-cancellable.ts
    │   ├── daily-alarm-limit.ts
    │   ├── emotion-corresponds-to-situation.ts
    │   ├── emotion-for-reappraisal-exists.ts
    │   ├── entries-for-week-exist.ts
    │   ├── entry-alarm-limit.ts
    │   ├── entry-has-been-started.ts
    │   ├── entry-is-actionable.ts
    │   ├── one-situation-per-entry.ts
    │   ├── reaction-corresponds-to-situation-and-emotion.ts
    │   ├── reaction-for-evaluation-exists.ts
    │   ├── requester-owns-entry.ts
    │   ├── weekly-review-completed-once.ts
    │   └── weekly-review-requested-once.ts
    ├── repositories
    │   ├── alarm-repository.ts
    │   ├── entry-repository.ts
    ├── routes
    │   ├── delete-entry.ts
    │   ├── evaluate-reaction.ts
    │   ├── list-entries.ts
    │   ├── log-entry.ts
    │   └── reappraise-emotion.ts
    ├── sagas
    │   ├── alarm-processing.ts
    │   └── weekly-review-processing.ts
    ├── services
    │   ├── ai-client.ts
    │   ├── alarm-detector.ts
    │   ├── alarm-factory.ts
    │   ├── alarms
    │   │   ├── alarm.ts
    │   │   └── negative-emotion-extreme-intensity-alarm.ts
    │   ├── emotional-advice-notification-composer.ts
    │   ├── emotional-advice-prompt.ts
    │   ├── pattern-detector.ts
    │   ├── patterns
    │   │   ├── low-coping-effectiveness-pattern.ts
    │   │   ├── more-negative-than-positive-emotions-pattern.ts
    │   │   ├── multiple-maladaptive-reactions-pattern.ts
    │   │   ├── pattern.ts
    │   │   └── positive-emotion-with-maladaptive-reaction-pattern.ts
    │   ├── weekly-review-insights-prompt.ts
    │   ├── weekly-review-notification-composer.ts
    │   ├── weekly-review-scheduler.ts
    │   └── weekly-review-skipped-notification-composer.ts
    └── value-objects
        ├── alarm-generated-at.ts
        ├── alarm-id.ts
        ├── alarm-name-option.ts
        ├── alarm-name.ts
        ├── alarm-status.ts
        ├── emotion-intensity.ts
        ├── emotion-label.ts
        ├── emotional-advice.ts
        ├── entry-finished-at.ts
        ├── entry-id.ts
        ├── entry-started-at.ts
        ├── entry-status.ts
        ├── geneva-wheel-emotion.enum.ts
        ├── gross-emotion-regulation-strategy.enum.ts
        ├── reaction-description.ts
        ├── reaction-effectiveness.ts
        ├── reaction-type.ts
        ├── situation-description.ts
        ├── situation-kind-options.ts
        ├── situation-kind.ts
        ├── situation-location.ts
        ├── week-start.ts
        ├── weekly-review-id.ts
        └── weekly-review-status.ts
```

## Infra:

```
infra/
├── anthropic-ai-client.ts
├── auth.ts
├── basic-auth-shield.ts
├── command-bus.ts
├── db.ts
├── e2e
│   ├── add-entry.spec.ts
│   └── home.spec.ts
├── env.ts
├── event-bus.ts
├── event-store.ts
├── healthcheck.ts
├── i18n.ts
├── jobs.ts
├── logger.ts
├── mailer.ts
├── open-ai-client.ts
├── prerequisites.ts
├── register-command-handlers.ts
├── register-event-handlers.ts
├── schema.ts
└── translations
    ├── en.json
    └── pl.json
```
