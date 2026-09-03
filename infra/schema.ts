// /* cSpell:ignore uidx */
import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { desc, relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { AdviceType } from "../modules/ai/value-objects/advice";
import type { UserIdType } from "../modules/auth/value-objects/user-id";
import type { AlarmIdType } from "../modules/emotions/value-objects/alarm-id";
// Imported separately because of Drizzle error in bgord-scripts/drizzle-generate.sh
import { AlarmNameOption } from "../modules/emotions/value-objects/alarm-name-option";
import { AlarmStatusEnum } from "../modules/emotions/value-objects/alarm-status";
import type { EntryIdType } from "../modules/emotions/value-objects/entry-id";
import { EntryOriginOption } from "../modules/emotions/value-objects/entry-origin-option";
import { EntryStatusEnum } from "../modules/emotions/value-objects/entry-status";
import { GenevaWheelEmotion } from "../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import { GrossEmotionRegulationStrategy } from "../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";
import { PatternNameOption } from "../modules/emotions/value-objects/pattern-name-option";
import { SituationKindOptions } from "../modules/emotions/value-objects/situation-kind-options";
import { TimeCapsuleEntryStatusEnum } from "../modules/emotions/value-objects/time-capsule-entry-status";
import type { WeeklyReviewIdType } from "../modules/emotions/value-objects/weekly-review-id";
import { WeeklyReviewStatusEnum } from "../modules/emotions/value-objects/weekly-review-status";
import { AccessValidity } from "../modules/publishing/value-objects/access-validity";
import type { ShareableLinkIdType } from "../modules/publishing/value-objects/shareable-link-id";
import { ShareableLinkStatusEnum } from "../modules/publishing/value-objects/shareable-link-status";
import { SupportedLanguages } from "../modules/supported-languages";

const toEnumList = (value: Record<string, string>) => {
  const [first, ...rest] = Object.keys(value);

  if (first === undefined) throw new Error("Enum list cannot be empty");

  return { enum: [first, ...rest] satisfies [string, ...ReadonlyArray<string>] };
};

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const identifier = <T extends string>() =>
  text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .$type<T>();

const timestamp = (name: string) => integer(name, { mode: "number" }).$type<tools.TimestampValueType>();

export const events = sqliteTable(
  "events",
  {
    id: identifier<bg.UUIDType>(),
    correlationId: text("correlationId").notNull().$type<bg.CorrelationIdType>(),
    createdAt: integer("createdAt").default(sql`now`).notNull(),
    name: text("name").notNull(),
    stream: text("stream").notNull().$type<bg.EventStreamType>(),
    version: integer("version").notNull(),
    revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
    commit: text("commit").notNull().$type<bg.CommitShaValueType>(),
    payload: text("payload").notNull(),
  },
  (table) => [
    index("stream_idx").on(table.stream),
    // cspell:disable-next-line
    uniqueIndex("stream_revision_uidx").on(table.stream, table.revision),
  ],
);

export const entries = sqliteTable("entries", {
  id: identifier<EntryIdType>(),
  revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
  startedAt: timestamp("startedAt").notNull(),
  situationDescription: text("situationDescription").notNull(),
  situationKind: text("situationKind", toEnumList(SituationKindOptions))
    .notNull()
    .$type<SituationKindOptions>(),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)).$type<GenevaWheelEmotion>(),
  emotionIntensity: integer("emotionIntensity"),
  reactionDescription: text("reactionDescription"),
  reactionType: text(
    "reactionType",
    toEnumList(GrossEmotionRegulationStrategy),
  ).$type<GrossEmotionRegulationStrategy>(),
  reactionEffectiveness: integer("reactionEffectiveness"),
  status: text("status", toEnumList(EntryStatusEnum)).notNull().$type<EntryStatusEnum>(),
  weekIsoId: text("weekIsoId").notNull().$type<tools.WeekIsoIdType>(),
  origin: text("origin", toEnumList(EntryOriginOption)).notNull().$type<EntryOriginOption>(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .$type<UserIdType>(),
});

export const entriesRelations = relations(entries, ({ one, many }) => ({
  /* every entry belongs to exactly one user */
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),

  /* any number of alarms can be generated for this entry */
  alarms: many(alarms, {
    relationName: "entryAlarms", // optional but helps disambiguate
  }),

  /* link to the weekly review for the same (userId, weekIsoId) */
  weeklyReview: one(weeklyReviews, {
    fields: [entries.weekIsoId, entries.userId],
    references: [weeklyReviews.weekIsoId, weeklyReviews.userId],
    relationName: "week", // shared with other composites
  }),
}));

export const timeCapsuleEntries = sqliteTable("timeCapsuleEntries", {
  id: identifier<EntryIdType>(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  situationDescription: text("situationDescription").notNull(),
  situationKind: text("situationKind", toEnumList(SituationKindOptions))
    .notNull()
    .$type<SituationKindOptions>(),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)).notNull().$type<GenevaWheelEmotion>(),
  emotionIntensity: integer("emotionIntensity").notNull(),
  reactionDescription: text("reactionDescription").notNull(),
  reactionType: text("reactionType", toEnumList(GrossEmotionRegulationStrategy))
    .notNull()
    .$type<GrossEmotionRegulationStrategy>(),
  reactionEffectiveness: integer("reactionEffectiveness").notNull(),
  status: text("status", toEnumList(TimeCapsuleEntryStatusEnum))
    .notNull()
    .$type<TimeCapsuleEntryStatusEnum>(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .$type<UserIdType>(),
});

export const alarms = sqliteTable("alarms", {
  id: identifier<AlarmIdType>(),
  generatedAt: timestamp("generatedAt").notNull(),
  entryId: text("entryId", { length: 36 })
    .references(() => entries.id, { onDelete: "cascade" })
    .$type<EntryIdType>(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .$type<UserIdType>(),
  status: text("status", toEnumList(AlarmStatusEnum)).notNull().$type<AlarmStatusEnum>(),
  name: text("name", toEnumList(AlarmNameOption)).notNull().$type<AlarmNameOption>(),
  advice: text("advice").$type<AdviceType>(),

  inactivityDays: integer("inactivityDays").$type<tools.IntegerPositiveType>(),
  lastEntryTimestamp: timestamp("lastEntryTimestamp"),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)).$type<GenevaWheelEmotion>(),
  emotionIntensity: integer("emotionIntensity"),

  weekIsoId: text("weekIsoId").notNull().$type<tools.WeekIsoIdType>(),
});

export const alarmsRelations = relations(alarms, ({ one }) => ({
  /** the entry that triggered this alarm (nullable) */
  entry: one(entries, {
    fields: [alarms.entryId],
    references: [entries.id],
    relationName: "entryAlarms", // disambiguates if you later join both directions
  }),

  /** the user who owns the alarm */
  user: one(users, {
    fields: [alarms.userId],
    references: [users.id],
  }),

  /*  link each alarm to its weeklyReview via (weekIsoId, userId) */
  weeklyReview: one(weeklyReviews, {
    fields: [alarms.weekIsoId, alarms.userId],
    references: [weeklyReviews.weekIsoId, weeklyReviews.userId],
    relationName: "week", // matches all other (user,week) joins
  }),
}));

export const patternDetections = sqliteTable("patternDetections", {
  id: identifier<bg.UUIDType>(),
  createdAt: timestamp("createdAt").notNull(),
  name: text("name", toEnumList(PatternNameOption)).notNull().$type<PatternNameOption>(),
  weekIsoId: text("weekIsoId").notNull().$type<tools.WeekIsoIdType>(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const patternDetectionsRelations = relations(patternDetections, ({ one }) => ({
  /** the user who owns the detection */
  user: one(users, {
    fields: [patternDetections.userId],
    references: [users.id],
  }),

  /** the weekly review for the same (userId, weekIsoId) pair */
  weeklyReview: one(weeklyReviews, {
    fields: [patternDetections.weekIsoId, patternDetections.userId],
    references: [weeklyReviews.weekIsoId, weeklyReviews.userId],
    relationName: "week", // shared across all (user,week) composites
  }),
}));

export const weeklyReviews = sqliteTable("weeklyReviews", {
  id: identifier<WeeklyReviewIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  weekIsoId: text("weekIsoId").notNull().$type<tools.WeekIsoIdType>(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .$type<UserIdType>(),
  insights: text("insights").$type<AdviceType>(),
  status: text("status", toEnumList(WeeklyReviewStatusEnum)).notNull().$type<WeeklyReviewStatusEnum>(),
});

export const weeklyReviewsRelations = relations(weeklyReviews, ({ one, many }) => ({
  /** owner of the review */
  user: one(users, {
    fields: [weeklyReviews.userId],
    references: [users.id],
  }),

  /** every entry whose (userId, weekIsoId) matches this review */
  entries: many(entries, {
    relationName: "week", // same name used on entriesRelations
  }),

  /** every pattern detection for the same user-week */
  patternDetections: many(patternDetections, {
    relationName: "week", // shares the composite join
  }),
  /*  every alarm that belongs to the same user-week */
  alarms: many(alarms, { relationName: "week" }),
}));

export const shareableLinks = sqliteTable("shareableLinks", {
  id: identifier<ShareableLinkIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  status: text("status", toEnumList(ShareableLinkStatusEnum)).notNull().$type<ShareableLinkStatusEnum>(),
  revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
  ownerId: text("ownerId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  publicationSpecification: text("publicationSpecification").notNull(),
  dateRangeStart: timestamp("dateRangeStart").notNull(),
  dateRangeEnd: timestamp("dateRangeEnd").notNull(),
  durationMs: integer("durationMs").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  hidden: integer("hidden", { mode: "boolean" }).default(false),
});

export const shareableLinksRelations = relations(shareableLinks, ({ one, many }) => ({
  owner: one(users, {
    fields: [shareableLinks.ownerId],
    references: [users.id],
    relationName: "userShareLinks",
  }),

  hits: many(shareableLinkHits),
}));

export const aiUsageCounters = sqliteTable("ai_usage_counters", {
  bucket: text("bucket").primaryKey(),
  ruleId: text("ruleId").notNull(),
  window: text("window").notNull(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  count: integer("count", { mode: "number" }).notNull().default(0),
  firstEventAt: timestamp("firstEventAt"),
  lastEventAt: timestamp("lastEventAt"),
});

export const history = sqliteTable(
  "history",
  {
    id: identifier<bg.History.VO.HistoryIdType>(),
    createdAt: timestamp("createdAt").notNull(),
    subject: text("subject").notNull().$type<bg.History.VO.HistorySubjectType>(),
    operation: text("operation").notNull().$type<bg.History.VO.HistoryOperationType>(),
    payload: text("payload").$type<bg.History.VO.HistoryPayloadParsedType>(),
  },
  (table) => [
    index("history_subject_createdAt").on(table.subject, desc(table.createdAt)),
    index("history_operation_createdAt").on(table.operation, desc(table.createdAt)),
    index("history_createdAt").on(desc(table.createdAt)),
  ],
);

export const shareableLinkHits = sqliteTable("shareable_link_hits", {
  id,
  shareableLinkId: text("shareableLinkId", { length: 36 })
    .notNull()
    .references(() => shareableLinks.id, { onDelete: "cascade" }),
  ownerId: text("ownerId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  publicationSpecification: text("publicationSpecification").notNull(),
  validity: text("validity", toEnumList(AccessValidity)).notNull().$type<AccessValidity>(),
  reason: text("reason").notNull(),
  visitorId: text("visitorId").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const shareableLinkHitsRelations = relations(shareableLinkHits, ({ one }) => ({
  link: one(shareableLinks, {
    fields: [shareableLinkHits.shareableLinkId],
    references: [shareableLinks.id],
    relationName: "linkHits",
  }),

  owner: one(users, {
    fields: [shareableLinkHits.ownerId],
    references: [users.id],
  }),
}));

export const userPreferences = sqliteTable(
  "user_preferences",
  {
    id,
    userId: text("userId", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    preference: text("preference", SupportedLanguages).notNull(),
    value: text("value").notNull().$type<tools.LanguageType>(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [
    // cspell:disable-next-line
    uniqueIndex("user_preferences_userId_preference_uidx").on(table.userId, table.preference),
    index("user_preferences_userId_idx").on(table.userId),
    index("user_preferences_preference_idx").on(table.preference),
  ],
);

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

export const userProfileAvatars = sqliteTable(
  "user_profile_avatars",
  {
    id,
    userId: text("userId", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    etag: text("etag").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [
    index("user_profile_avatars_userId_idx").on(table.userId),
    uniqueIndex("user_profile_avatars_userId_uniq").on(table.userId),
  ],
);

export const userProfileAvatarsRelations = relations(userProfileAvatars, ({ one }) => ({
  user: one(users, { fields: [userProfileAvatars.userId], references: [users.id] }),
}));

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$type<UserIdType>(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => !1)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    // biome-ignore lint: lint/style/noRestrictedGlobals
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    // biome-ignore lint: lint/style/noRestrictedGlobals
    .$defaultFn(() => new Date())
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  /* --- core aggregates a user owns ------------------------------------ */
  entries: many(entries),
  alarms: many(alarms),
  weeklyReviews: many(weeklyReviews),

  /* shareable links: same relationName used on the child side */
  shareableLinks: many(shareableLinks, { relationName: "userShareLinks" }),

  /* if you often load detections straight from a user, expose them here */
  patternDetections: many(patternDetections),
}));

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    issuer: text("issuer").notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    uniqueIndex("accounts_issuer_accountId_uidx").on(table.issuer, table.accountId),
    index("accounts_userId_idx").on(table.userId),
  ],
);

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type SelectEntries = typeof entries.$inferSelect;
export type SelectEntriesWithAlarms = SelectEntries & { alarms: ReadonlyArray<SelectAlarms> };
export type SelectAlarms = typeof alarms.$inferSelect;
export type SelectShareableLinks = typeof shareableLinks.$inferSelect;
export type SelectWeeklyReviews = typeof weeklyReviews.$inferSelect;
export type SelectPatternDetections = typeof patternDetections.$inferSelect;
