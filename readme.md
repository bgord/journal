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
./bgord-scripts/bun-local-server-start.sh
```

Run the tests

```
./bgord-scripts/bun-test-run.sh
```

## Domain:

```
modules/
└── emotions
    ├── aggregates
    │   ├── emotion-journal-entry.ts
    ├── entities
    │   ├── emotion.ts
    │   ├── reaction.ts
    │   └── situation.ts
    ├── events
    │   ├── EMOTION_JOURNAL_ENTRY_DELETED.ts
    │   ├── EMOTION_LOGGED_EVENT.ts
    │   ├── EMOTION_REAPPRAISED_EVENT.ts
    │   ├── MORE_NEGATIVE_THAN_POSITIVE_EMOTIONS_PATTERN_DETECTED_EVENT.ts
    │   ├── MULTIPLE_MALADAPTIVE_REACTIONS_PATTERN_DETECTED_EVENT.ts
    │   ├── POSITIVE_EMOTION_WITH_MALADAPTIVE_REACTION_PATTERN_DETECTED_EVENT.ts
    │   ├── REACTION_EVALUATED_EVENT.ts
    │   ├── REACTION_LOGGED_EVENT.ts
    │   ├── SITUATION_LOGGED_EVENT.ts
    ├── policies
    │   ├── emotion-corresponds-to-situation.ts
    │   ├── emotion-for-reappraisal-exists.ts
    │   ├── entry-has-been-started.ts
    │   ├── entry-is-actionable.ts
    │   ├── one-emotion-per-entry.ts
    │   ├── one-reaction-per-entry.ts
    │   ├── one-situation-per-entry.ts
    │   ├── reaction-corresponds-to-situation-and-emotion.ts
    │   └── reaction-for-evaluation-exists.ts
    ├── routes
    │   ├── delete-journal-entry.ts
    │   ├── evaluate-reaction.ts
    │   ├── log-emotion.ts
    │   ├── log-reaction.ts
    │   ├── log-situation.ts
    │   └── reappraise-emotion.ts
    ├── services
    │   ├── pattern-detector.ts
    │   └── patterns
    │       ├── more-negative-than-positive-emotions-pattern.ts
    │       ├── multiple-maladaptive-reactions-pattern.ts
    │       ├── pattern.ts
    │       └── positive-emotion-with-maladaptive-reaction-pattern.ts
    └── value-objects
        ├── emotion-intensity.ts
        ├── emotion-journal-entry-finished-at.ts
        ├── emotion-journal-entry-id.ts
        ├── emotion-journal-entry-started-at.ts
        ├── emotion-journal-entry-status.ts
        ├── emotion-label.ts
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
├── basic-auth-shield.ts
├── db.ts
├── env.ts
├── event-store.ts
├── healthcheck.ts
├── i18n.ts
├── logger.ts
├── mailer.ts
├── prerequisites.ts
└── schema.ts
```
