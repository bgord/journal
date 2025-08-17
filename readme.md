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
├── ai
│   ├── events
│   │   ├── AI_QUOTA_EXCEEDED_EVENT.ts
│   │   ├── AI_REQUEST_REGISTERED_EVENT.ts
│   ├── open-host-services
│   │   ├── ai-gateway.ts
│   ├── ports
│   │   ├── ai-client.ts
│   │   ├── ai-gateway.ts
│   │   ├── bucket-counter.ts
│   ├── services
│   │   └── quota-rule-selector.ts
│   ├── specifications
│   │   └── quota-specification.ts
│   └── value-objects
│       ├── advice.ts
│       ├── prompt.ts
│       ├── quota-bucket.ts
│       ├── quota-limit.ts
│       ├── quota-rule-id.ts
│       ├── quota-rule.ts
│       ├── quota-rules.ts
│       ├── quota-usage.ts
│       ├── quota-window.ts
│       ├── request-context.ts
│       └── usage-category.ts
├── auth
│   ├── events
│   │   ├── ACCOUNT_CREATED_EVENT.ts
│   │   ├── ACCOUNT_DELETED_EVENT.ts
│   ├── repositories
│   │   └── user-repository.ts
│   ├── services
│   │   ├── email-verification-notification-composer.ts
│   │   └── password-reset-notification-composer.ts
│   └── value-objects
│       ├── password.ts
│       └── user-id.ts
├── emotions
│   ├── acl
│   │   ├── ai-prompts
│   │   │   ├── alarm-prompt-factory.ts
│   │   │   ├── entry-alarm-advice-prompt-builder.ts
│   │   │   ├── inactivity-alarm-advice-prompt-builder.ts
│   │   │   └── weekly-review-insights-prompt-builder.ts
│   │   ├── ai-request-creator.ts
│   ├── aggregates
│   │   ├── alarm.ts
│   │   ├── entry.ts
│   │   └── weekly-review.ts
│   ├── command-handlers
│   │   ├── handleCancelAlarmCommand.ts
│   │   ├── handleCompleteAlarmCommand.ts
│   │   ├── handleCompleteWeeklyReviewCommand.ts
│   │   ├── handleDeleteEntryCommand.ts
│   │   ├── handleDetectWeeklyPatternsCommand.ts
│   │   ├── handleEvaluateReactionCommand.ts
│   │   ├── handleExportWeeklyReviewByEmailCommand.ts
│   │   ├── handleGenerateAlarmCommand.ts
│   │   ├── handleLogEntryCommand.ts
│   │   ├── handleMarkWeeklyReviewAsFailedCommand.ts
│   │   ├── handleReappraiseEmotionCommand.ts
│   │   ├── handleRequestAlarmNotificationCommand.ts
│   │   ├── handleRequestWeeklyReviewCommand.ts
│   │   ├── handleSaveAlarmAdviceCommand.ts
│   │   ├── handleScheduleTimeCapsuleEntryCommand.ts
│   ├── commands
│   │   ├── CANCEL_ALARM_COMMAND.ts
│   │   ├── COMPLETE_ALARM_COMMAND.ts
│   │   ├── COMPLETE_WEEKLY_REVIEW_COMMAND.ts
│   │   ├── DELETE_ENTRY_COMMAND.ts
│   │   ├── DETECT_WEEKLY_PATTERNS_COMMAND.ts
│   │   ├── EVALUATE_REACTION_COMMAND.ts
│   │   ├── EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND.ts
│   │   ├── GENERATE_ALARM_COMMAND.ts
│   │   ├── LOG_ENTRY_COMMAND.ts
│   │   ├── MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND.ts
│   │   ├── REAPPRAISE_EMOTION_COMMAND.ts
│   │   ├── REQUEST_ALARM_NOTIFICATION_COMMAND.ts
│   │   ├── REQUEST_WEEKLY_REVIEW_COMMAND.ts
│   │   ├── SAVE_ALARM_ADVICE_COMMAND.ts
│   │   ├── SCHEDULE_TIME_CAPSULE_ENTRY.ts
│   ├── entities
│   │   ├── emotion.ts
│   │   ├── reaction.ts
│   │   └── situation.ts
│   ├── events
│   │   ├── ALARM_ADVICE_SAVED_EVENT.ts
│   │   ├── ALARM_CANCELLED_EVENT.ts
│   │   ├── ALARM_GENERATED_EVENT.ts
│   │   ├── ALARM_NOTIFICATION_REQUESTED_EVENT.ts
│   │   ├── ALARM_NOTIFICATION_SENT_EVENT.ts
│   │   ├── EMOTION_LOGGED_EVENT.ts
│   │   ├── EMOTION_REAPPRAISED_EVENT.ts
│   │   ├── ENTRY_DELETED_EVENT.ts
│   │   ├── LOW_COPING_EFFECTIVENESS_PATTERN_DETECTED_EVENT.ts
│   │   ├── MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT.ts
│   │   ├── MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT.ts
│   │   ├── POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT.ts
│   │   ├── REACTION_EVALUATED_EVENT.ts
│   │   ├── REACTION_LOGGED_EVENT.ts
│   │   ├── SITUATION_LOGGED_EVENT.ts
│   │   ├── TIME_CAPSULE_ENTRY_SCHEDULED_EVENT.ts
│   │   ├── WEEKLY_REVIEW_COMPLETED_EVENT.ts
│   │   ├── WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED.ts
│   │   ├── WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED.ts
│   │   ├── WEEKLY_REVIEW_FAILED_EVENT.ts
│   │   ├── WEEKLY_REVIEW_REQUESTED_EVENT.ts
│   │   ├── WEEKLY_REVIEW_SKIPPED_EVENT.ts
│   ├── invariants
│   │   ├── alarm-advice-available.ts
│   │   ├── alarm-already-generated.ts
│   │   ├── alarm-is-cancellable.ts
│   │   ├── alarm-notification-requested.ts
│   │   ├── emotion-corresponds-to-situation.ts
│   │   ├── emotion-for-reappraisal-exists.ts
│   │   ├── entries-for-week-exist.ts
│   │   ├── entry-has-been-started.ts
│   │   ├── entry-is-actionable.ts
│   │   ├── inactivity-alarm-schedule.ts
│   │   ├── no-entries-in-the-last-week.ts
│   │   ├── reaction-corresponds-to-situation-and-emotion.ts
│   │   ├── reaction-for-evaluation-exists.ts
│   │   ├── requester-owns-entry.ts
│   │   ├── requester-owns-weekly-review.ts
│   │   ├── time-capsule-entry-is-publishable.ts
│   │   ├── time-capsule-entry-scheduled-in-future.ts
│   │   ├── weekly-review-completed-once.ts
│   │   ├── weekly-review-exists.ts
│   │   ├── weekly-review-is-completed.ts
│   │   └── weekly-review-schedule.ts
│   ├── policies
│   │   ├── entry-alarm-detector.ts
│   │   ├── entry-history-publisher.ts
│   │   ├── inactivity-alarm-scheduler.ts
│   │   ├── time-capsule-entries-scheduler.ts
│   │   └── weekly-review-scheduler.ts
│   ├── ports
│   │   ├── alarm-cancellation-lookup.ts
│   │   └── pdf-generator.ts
│   ├── queries
│   │   ├── count-entries-per-week-for-user.ts
│   │   ├── get-latest-entry-timestamp-for-user.ts
│   │   └── weekly-review-export-dto.ts
│   ├── repositories
│   │   ├── alarm-repository.ts
│   │   ├── entry-repository.ts
│   │   ├── time-capsule-entry-repository.ts
│   │   └── weekly-review-repository.ts
│   ├── routes
│   │   ├── delete-entry.ts
│   │   ├── download-weekly-review.ts
│   │   ├── evaluate-reaction.ts
│   │   ├── export-entries.ts
│   │   ├── export-weekly-review-by-email.ts
│   │   ├── get-shared-entries.ts
│   │   ├── log-entry.ts
│   │   ├── reappraise-emotion.ts
│   │   └── schedule-time-capsule-entry.ts
│   ├── sagas
│   │   ├── alarm-orchestrator.ts
│   │   ├── weekly-review-export-by-email.ts
│   │   └── weekly-review-processing.ts
│   ├── services
│   │   ├── alarm-export-file.ts
│   │   ├── alarm-notification-factory.ts
│   │   ├── emotion-alarm-detector.ts
│   │   ├── emotion-alarm-template.ts
│   │   ├── entry-alarm-advice-notification-composer.ts
│   │   ├── entry-export-file.ts
│   │   ├── inactivity-alarm-advice-notification-composer.ts
│   │   ├── negative-emotion-extreme-intensity-alarm.ts
│   │   ├── pattern-detector.ts
│   │   ├── patterns
│   │   │   ├── low-coping-effectiveness-pattern.ts
│   │   │   ├── maladaptive-reactions-pattern.ts
│   │   │   ├── more-negative-than-positive-emotions-pattern.ts
│   │   │   ├── pattern.ts
│   │   │   └── positive-emotion-with-maladaptive-reaction-pattern.ts
│   │   ├── weekly-review-export-notification-composer.ts
│   │   ├── weekly-review-export-pdf-file.ts
│   │   └── weekly-review-skipped-notification-composer.ts
│   └── value-objects
│       ├── alarm-detection.ts
│       ├── alarm-generated-at.ts
│       ├── alarm-id.ts
│       ├── alarm-name-option.ts
│       ├── alarm-name.ts
│       ├── alarm-status.ts
│       ├── alarm-trigger.ts
│       ├── emotion-intensity.ts
│       ├── emotion-label.ts
│       ├── entry-finished-at.ts
│       ├── entry-id.ts
│       ├── entry-origin-option.ts
│       ├── entry-origin.ts
│       ├── entry-started-at.ts
│       ├── entry-status.ts
│       ├── geneva-wheel-emotion.enum.ts
│       ├── gross-emotion-regulation-strategy.enum.ts
│       ├── pattern-name-option.ts
│       ├── pattern-name.ts
│       ├── reaction-description.ts
│       ├── reaction-effectiveness.ts
│       ├── reaction-type.ts
│       ├── situation-description.ts
│       ├── situation-kind-options.ts
│       ├── situation-kind.ts
│       ├── situation-location.ts
│       ├── time-capsule-entry-status.ts
│       ├── weekly-review-export-id.ts
│       ├── weekly-review-id.ts
│       └── weekly-review-status.ts
└── publishing
    ├── aggregates
    │   └── shareable-link.ts
    ├── command-handlers
    │   ├── handleCreateShareableLinkCommand.ts
    │   ├── handleExpireShareableLinkCommand.ts
    │   ├── handleRevokeShareableLinkCommand.ts
    ├── commands
    │   ├── CREATE_SHAREABLE_LINK_COMMAND.ts
    │   ├── EXPIRE_SHAREABLE_LINK_COMMAND.ts
    │   ├── REVOKE_SHAREABLE_LINK_COMMAND.ts
    ├── events
    │   ├── SHAREABLE_LINK_CREATED_EVENT.ts
    │   ├── SHAREABLE_LINK_EXPIRED_EVENT.ts
    │   ├── SHAREABLE_LINK_REVOKED_EVENT.ts
    ├── invariants
    │   ├── requester-owns-shareable-link.ts
    │   ├── shareable-link-expiration-time-passed.ts
    │   ├── shareable-link-is-active.ts
    │   └── shareable-links-per-owner-limit.ts
    ├── open-host-queries
    │   └── shareable-link-access.ts
    ├── policies
    │   └── shareable-links-expirer.ts
    ├── ports
    │   ├── expiring-shareable-links.ts
    ├── queries
    │   ├── count-active-shareable-links-per-owner.ts
    ├── routes
    │   ├── create-shareable-link.ts
    │   └── revoke-shareable-link.ts
    └── value-objects
        ├── publication-specification.ts
        ├── shareable-link-id.ts
        └── shareable-link-status.ts
```

## Infra:

```
infra/
├── adapters
│   ├── ai
│   │   ├── ai-client-antrhopic.adapter.ts
│   │   ├── ai-client-noop.adapter.ts
│   │   ├── ai-client-open-ai.adapter.ts
│   │   ├── ai-client.adapter.ts
│   │   ├── ai-gateway.adapter.ts
│   │   ├── bucket-counter-drizzle.adapter.ts
│   │   ├── bucket-counter.adapter.ts
│   ├── emotions
│   │   ├── alarm-cancellation-lookup-drizzle.adapter.ts
│   │   ├── alarm-cancellation-lookup.adapter.ts
│   │   ├── pdf-generator-noop.adapter.ts
│   │   ├── pdf-generator-react.adapter.tsx
│   │   └── pdf-generator.adapter.ts
│   ├── history
│   │   ├── history-repository-drizzle.adapter.ts
│   │   ├── history-repository.adapter.ts
│   │   ├── history-writer-event-store.adapter.ts
│   │   ├── history-writer.adapter.ts
│   ├── mailer.adapter.ts
│   └── publishing
│       ├── expiring-shareable-links.drizzle.ts
│       ├── expiring-shareable-links.ts
├── auth.ts
├── basic-auth-shield.ts
├── cache.ts
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
├── prerequisites.ts
├── projections
│   ├── ai-usage-counter.projector.ts
│   ├── alarm.projector.ts
│   ├── entry.projector.ts
│   ├── history.projector.ts
│   ├── pattern-detection.projector.ts
│   ├── shareable-link.projector.ts
│   └── weekly-review.projector.ts
├── rate-limiters.ts
├── register-command-handlers.ts
├── register-event-handlers.ts
├── response-cache.ts
├── schema.ts
└── translations
    ├── en.json
    └── pl.json
```
