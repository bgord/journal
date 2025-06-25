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
└── emotions
    ├── aggregates
    │   ├── alarm.ts
    │   ├── emotion-journal-entry.ts
    ├── entities
    │   ├── emotion.ts
    │   ├── reaction.ts
    │   └── situation.ts
    ├── events
    │   ├── ALARM_ADVICE_SAVED_EVENT.ts
    │   ├── ALARM_CANCELLED_EVENT.ts
    │   ├── ALARM_GENERATED_EVENT.ts
    │   ├── ALARM_NOTIFICATION_SENT_EVENT.ts
    │   ├── EMOTION_JOURNAL_ENTRY_DELETED_EVENT.ts
    │   ├── EMOTION_LOGGED_EVENT.ts
    │   ├── EMOTION_REAPPRAISED_EVENT.ts
    │   ├── LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT.ts
    │   ├── MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT.ts
    │   ├── MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT.ts
    │   ├── POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT.ts
    │   ├── REACTION_EVALUATED_EVENT.ts
    │   ├── REACTION_LOGGED_EVENT.ts
    │   ├── SITUATION_LOGGED_EVENT.ts
    ├── handlers
    │   ├── onAlarmAdviceSavedEvent.ts
    │   ├── onAlarmCancelledEvent.ts
    │   ├── onAlarmGeneratedEvent.ts
    │   ├── onAlarmNotificationSentEvent.ts
    │   ├── onEmotionJournalEntryDeleted.ts
    │   ├── onEmotionLoggedEvent.ts
    │   ├── onEmotionReappraisedEvent.ts
    │   ├── onLowCopingEffectivenessPatternDetectedEvent.ts
    │   ├── onMoreNegativeThanPositiveEmotionsPatternDetectedEvent.ts
    │   ├── onMultipleMaladaptiveReactionsPatternDetectedEvent.ts
    │   ├── onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent.ts
    │   ├── onReactionEvaluatedEvent.ts
    │   ├── onReactionLoggedEvent.ts
    │   └── onSituationLoggedEvent.ts
    ├── policies
    │   ├── alarm-advice-available.ts
    │   ├── alarm-already-generated.ts
    │   ├── alarm-generated-once.ts
    │   ├── alarm-is-cancellable.ts
    │   ├── emotion-corresponds-to-situation.ts
    │   ├── emotion-for-reappraisal-exists.ts
    │   ├── entry-has-been-started.ts
    │   ├── entry-is-actionable.ts
    │   ├── one-emotion-per-entry.ts
    │   ├── one-reaction-per-entry.ts
    │   ├── one-situation-per-entry.ts
    │   ├── reaction-corresponds-to-situation-and-emotion.ts
    │   └── reaction-for-evaluation-exists.ts
    ├── repositories
    │   ├── alarm-repository.ts
    │   ├── emotion-journal-entry-repository.ts
    ├── routes
    │   ├── delete-journal-entry.ts
    │   ├── evaluate-reaction.ts
    │   ├── log-emotion.ts
    │   ├── log-reaction.ts
    │   ├── log-situation.ts
    │   └── reappraise-emotion.ts
    ├── sagas
    │   ├── alarm-processing.ts
    ├── services
    │   ├── ai-client.ts
    │   ├── alarm-generator.ts
    │   ├── alarms
    │   │   ├── alarm.ts
    │   │   └── negative-emotion-extreme-intensity-alarm.ts
    │   ├── emotional-advice-notification-composer.ts
    │   ├── emotional-advice-prompt.ts
    │   ├── emotional-advice-requester.ts
    │   ├── pattern-detector.ts
    │   └── patterns
    │       ├── low-coping-effectiveness-pattern.ts
    │       ├── more-negative-than-positive-emotions-pattern.ts
    │       ├── multiple-maladaptive-reactions-pattern.ts
    │       ├── pattern.ts
    │       └── positive-emotion-with-maladaptive-reaction-pattern.ts
    └── value-objects
        ├── alarm-generated-at.ts
        ├── alarm-id.ts
        ├── alarm-name.ts
        ├── alarm-status.ts
        ├── emotion-intensity.ts
        ├── emotion-journal-entry-finished-at.ts
        ├── emotion-journal-entry-id.ts
        ├── emotion-journal-entry-started-at.ts
        ├── emotion-journal-entry-status.ts
        ├── emotion-label.ts
        ├── emotional-advice.ts
        ├── geneva-wheel-emotion.enum.ts
        ├── gross-emotion-regulation-strategy.enum.ts
        ├── reaction-description.ts
        ├── reaction-effectiveness.ts
        ├── reaction-type.ts
        ├── situation-description.ts
        ├── situation-kind.ts
        └── situation-location.ts
```

## Infra:

```
infra/
├── anthropic-ai-client.ts
├── basic-auth-shield.ts
├── db.ts
├── env.ts
├── event-bus.ts
├── event-store.ts
├── healthcheck.ts
├── i18n.ts
├── logger.ts
├── mailer.ts
├── open-ai-client.ts
├── prerequisites.ts
├── register-event-handlers.ts
└── schema.ts
```
