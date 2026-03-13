# journal

[![Deploy](https://github.com/bgord/journal/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/bgord/journal/actions/workflows/deploy-server.yml)

[![Healthcheck](https://github.com/bgord/journal/actions/workflows/healthcheck.yml/badge.svg)](https://github.com/bgord/journal/actions/workflows/healthcheck.yml)

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

Generate production master key

Master key fils hould include 64 hex characters

```
bun run bgord-scripts/secrets-encrypt.ts --master-key /run/master-key.txt --input /project/path/.env.production --output /project/path/infra/secrets.enc
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
│   │   ├── ai-event-publisher.ts
│   │   ├── ai-gateway.ts
│   │   ├── bucket-counter.ts
│   │   └── rule-inspector.ts
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
│       ├── quota-rule-inspection.ts
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
│   ├── open-host-queries
│   │   ├── user-contact.ts
│   │   └── user-directory.ts
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
│   ├── open-host-queries
│   │   ├── entries-sharing.ts
│   ├── policies
│   │   ├── entry-alarm-detector.ts
│   │   ├── entry-history-publisher.ts
│   │   ├── inactivity-alarm-scheduler.ts
│   │   ├── time-capsule-entries-scheduler.ts
│   │   ├── time-capsule-entry-notifier.ts
│   │   └── weekly-review-scheduler.ts
│   ├── ports
│   │   ├── alarm-cancellation-lookup.ts
│   │   ├── alarm-directory.ts
│   │   ├── alarm-repository.ts
│   │   ├── entry-repository.ts
│   │   ├── entry-snapshot.ts
│   │   ├── time-capsule-due-entries.ts
│   │   ├── weekly-review-repository.ts
│   │   └── weekly-review-snapshot.ts
│   ├── queries
│   │   ├── entries-per-week-count.ts
│   │   ├── get-latest-entry-timestamp-for-user.ts
│   │   └── weekly-review-export.ts
│   ├── sagas
│   │   ├── alarm-orchestrator.ts
│   │   ├── weekly-review-export-by-email.ts
│   │   └── weekly-review-processing.ts
│   ├── services
│   │   ├── alarm-export-file-csv.ts
│   │   ├── alarm-notification-factory.ts
│   │   ├── emotion-alarm-detector.ts
│   │   ├── emotion-alarm-template.ts
│   │   ├── entry-alarm-advice-notification-composer.ts
│   │   ├── entry-export-file-csv.ts
│   │   ├── entry-export-file-markdown.ts
│   │   ├── entry-export-file-pdf.ts
│   │   ├── entry-export-file-text.ts
│   │   ├── inactivity-alarm-advice-notification-composer.ts
│   │   ├── negative-emotion-extreme-intensity-alarm.ts
│   │   ├── pattern-detector.ts
│   │   ├── patterns
│   │   │   ├── low-coping-effectiveness-pattern.ts
│   │   │   ├── maladaptive-reactions-pattern.ts
│   │   │   ├── more-negative-than-positive-emotions-pattern.ts
│   │   │   ├── pattern.ts
│   │   │   └── positive-emotion-with-maladaptive-reaction-pattern.ts
│   │   ├── time-capsule-entry-notification-composer.ts
│   │   ├── weekly-review-export-notification-composer.ts
│   │   ├── weekly-review-export-pdf-file.ts
│   │   └── weekly-review-skipped-notification-composer.ts
│   └── value-objects
│       ├── alarm-detection.ts
│       ├── alarm-generated-at.ts
│       ├── alarm-id.ts
│       ├── alarm-name-option.ts
│       ├── alarm-name.ts
│       ├── alarm-snapshot.ts
│       ├── alarm-status.ts
│       ├── alarm-trigger.ts
│       ├── emotion-intensity.ts
│       ├── emotion-intensity.validation.ts
│       ├── emotion-label.ts
│       ├── entry-export-strategy-options.ts
│       ├── entry-export-strategy.ts
│       ├── entry-finished-at.ts
│       ├── entry-id.ts
│       ├── entry-list-filter-options.ts
│       ├── entry-list-filter.ts
│       ├── entry-origin-option.ts
│       ├── entry-origin.ts
│       ├── entry-snapshot.ts
│       ├── entry-started-at.ts
│       ├── entry-status.ts
│       ├── geneva-wheel-emotion.enum.ts
│       ├── gross-emotion-regulation-strategy.enum.ts
│       ├── pattern-detection-snapshot.ts
│       ├── pattern-name-option.ts
│       ├── pattern-name.ts
│       ├── reaction-description.ts
│       ├── reaction-description.validation.ts
│       ├── reaction-effectiveness.ts
│       ├── reaction-effectiveness.validation.ts
│       ├── reaction-type.ts
│       ├── situation-description.ts
│       ├── situation-description.validation.ts
│       ├── situation-kind-options.ts
│       ├── situation-kind.ts
│       ├── time-capsule-entry-status.ts
│       ├── weekly-review-export-id.ts
│       ├── weekly-review-id.ts
│       ├── weekly-review-snapshot.ts
│       └── weekly-review-status.ts
├── languages.ts
├── preferences
│   ├── command-handlers
│   │   ├── handleRemoveProfileAvatarCommand.ts
│   │   ├── handleUpdateProfileAvatarCommand.ts
│   ├── commands
│   │   ├── REMOVE_PROFILE_AVATAR_COMMAND.ts
│   │   ├── UPDATE_PROFILE_AVATAR_COMMAND.ts
│   ├── events
│   │   ├── PROFILE_AVATAR_REMOVED_EVENT.ts
│   │   ├── PROFILE_AVATAR_UPDATED_EVENT.ts
│   ├── invariants
│   │   └── profile-avatar-constraints.ts
│   ├── policies
│   │   └── set-default-user-language.ts
│   └── value-objects
│       ├── profile-avatar-key.ts
│       ├── profile-avatar-max-side.ts
│       ├── profile-avatar-max-size.ts
│       ├── profile-avatar-mime-registry.ts
│       └── profile-avatar-side.ts
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
    │   ├── SHAREABLE_LINK_ACCESSED_EVENT.ts
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
    │   ├── shareable-link-access-auditor.ts
    │   ├── shareable-link-repository.ts
    │   └── shareable-link-snapshot.ts
    ├── queries
    │   └── shareable-links-quota.ts
    └── value-objects
        ├── access-context.ts
        ├── access-validity.ts
        ├── publication-specification.ts
        ├── shareable-link-id.ts
        ├── shareable-link-snapshot.ts
        └── shareable-link-status.ts
```

## App:

```
app/
├── http
│   ├── ai
│   │   ├── get-ai-usage-today.ts
│   ├── emotions
│   │   ├── delete-entry.ts
│   │   ├── download-weekly-review.ts
│   │   ├── evaluate-reaction.ts
│   │   ├── export-data.ts
│   │   ├── export-entries.ts
│   │   ├── export-weekly-review-by-email.ts
│   │   ├── get-shared-entries.ts
│   │   ├── list-entries.ts
│   │   ├── log-entry.ts
│   │   ├── reappraise-emotion.ts
│   │   └── schedule-time-capsule-entry.ts
│   ├── error-handler.ts
│   ├── get-dashboard.ts
│   ├── history
│   │   ├── history-list.ts
│   ├── preferences
│   │   ├── get-profile-avatar.ts
│   │   ├── remove-profile-avatar.ts
│   │   ├── update-profile-avatar.ts
│   │   └── update-user-language.ts
│   └── publishing
│       ├── create-shareable-link.ts
│       ├── hide-shareable-link.ts
│       ├── list-shareable-links.ts
│       └── revoke-shareable-link.ts
└── services
    ├── create-shareable-link-form.ts
    ├── home-entry-add-form.ts
    ├── home-entry-export-form.ts
    ├── home-entry-list-form.ts
    └── weekly-review-form.ts
```

## Infra:

```
infra/
├── adapters
│   ├── ai
│   │   ├── ai-client-anthropic.adapter.ts
│   │   ├── ai-client-noop.adapter.ts
│   │   ├── ai-client-open-ai.adapter.ts
│   │   ├── ai-client.adapter.ts
│   │   ├── ai-event-publisher.adapter.ts
│   │   ├── ai-gateway.adapter.ts
│   │   ├── bucket-counter.adapter.ts
│   │   └── rule-inspector.adapter.ts
│   ├── auth
│   │   ├── user-contact.adapter.ts
│   │   └── user-directory.adapter.ts
│   ├── emotions
│   │   ├── alarm-cancellation-lookup.adapter.ts
│   │   ├── alarm-directory.adapter.ts
│   │   ├── alarm-repository.adapter.ts
│   │   ├── entries-per-week-count.adapter.ts
│   │   ├── entries-sharing.adapter.ts
│   │   ├── entry-repository.adapter.ts
│   │   ├── entry-snapshot.adapter.ts
│   │   ├── get-latest-entry-timestamp-for-user.adapter.ts
│   │   ├── pdf-generator-tinypdf.adapter.tsx
│   │   ├── pdf-generator.adapter.ts
│   │   ├── time-capsule-due-entries.adapter.ts
│   │   ├── weekly-review-export.adapter.ts
│   │   ├── weekly-review-repository.adapter.ts
│   │   └── weekly-review-snapshot.adapter.ts
│   ├── history
│   │   ├── history-projection.adapter.ts
│   │   ├── history-reader.adapter.ts
│   │   ├── history-writer.adapter.ts
│   ├── preferences
│   │   ├── user-language-ohq.adapter.ts
│   │   └── user-language-query.adapter.ts
│   ├── publishing
│   │   ├── expiring-shareable-links.ts
│   │   ├── shareable-link-access-auditor.adapter.ts
│   │   ├── shareable-link-access.adapter.ts
│   │   ├── shareable-link-repository.adapter.ts
│   │   ├── shareable-link-snapshot.adapter.ts
│   │   └── shareable-links-quota.adapter.ts
│   └── system
│       ├── certificate-inspector.adapter.ts
│       ├── clock.adapter.ts
│       ├── csv-stringifier.adapter.ts
│       ├── disk-space-checker.adapter.ts
│       ├── file-cleaner.adapter.ts
│       ├── file-inspection.adapter.ts
│       ├── file-reader-json.adapter.ts
│       ├── file-renamer.adapter.ts
│       ├── file-writer.adapter.ts
│       ├── hash-file.adapter.ts
│       ├── id-provider.adapter.ts
│       ├── image-info.adapter.ts
│       ├── image-processor.adapter.ts
│       ├── logger.adapter.ts
│       ├── mailer.adapter.ts
│       ├── nonce-provider.adapter.ts
│       ├── remote-file-storage.adapter.ts
│       ├── sleeper.adapter.ts
│       ├── temporary-file.adapter.ts
│       ├── timekeeper.adapter.ts
│       └── timeout-runner.adapter.ts
├── bootstrap.ts
├── db.ts
├── depcruise.webpack.cjs
├── e2e
│   └── home.spec.ts
├── env.ts
├── profile-avatars
├── projections
│   ├── ai-usage-counter.projector.ts
│   ├── alarm.projector.ts
│   ├── entry.projector.ts
│   ├── history.projector.ts
│   ├── pattern-detection.projector.ts
│   ├── preferences.projector.ts
│   ├── profile-avatars.projector.ts
│   ├── shareable-link-hits.projector.ts
│   ├── shareable-link.projector.ts
│   └── weekly-review.projector.ts
├── register-command-handlers.ts
├── register-event-handlers.ts
├── register-sse-handlers.ts
├── schema.ts
├── tools
│   ├── build-info-repository.strategy.ts
│   ├── cache-response.ts
│   ├── command-bus.ts
│   ├── event-bus.ts
│   ├── event-handler.ts
│   ├── event-store.ts
│   ├── hash-content.strategy.ts
│   ├── job-handler.adapter.ts
│   ├── jobs.ts
│   ├── prerequisites.ts
│   ├── shield-auth.strategy.ts
│   ├── shield-basic-auth.strategy.ts
│   ├── shield-captcha.strategy.ts
│   ├── shield-rate-limit.strategy.ts
│   ├── shield-security.strategy.ts
│   ├── shield-timeout.strategy.ts
│   └── sse-registry.adapter.ts
└── translations
    ├── en.json
    └── pl.json
```
