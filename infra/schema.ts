import { desc, relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
// Imported separately because of Drizzle error in bgord-scripts/drizzle-generate.sh
import { AlarmNameOption } from "../modules/emotions/value-objects/alarm-name-option";
import { AlarmStatusEnum } from "../modules/emotions/value-objects/alarm-status";
import { EntryOriginOption } from "../modules/emotions/value-objects/entry-origin-option";
import { EntryStatusEnum } from "../modules/emotions/value-objects/entry-status";
import { GenevaWheelEmotion } from "../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import { GrossEmotionRegulationStrategy } from "../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";
import { PatternNameOption } from "../modules/emotions/value-objects/pattern-name-option";
import { SituationKindOptions } from "../modules/emotions/value-objects/situation-kind-options";
import { TimeCapsuleEntryStatusEnum } from "../modules/emotions/value-objects/time-capsule-entry-status";
import { WeeklyReviewStatusEnum } from "../modules/emotions/value-objects/weekly-review-status";
import { ShareableLinkStatusEnum } from "../modules/publishing/value-objects/shareable-link-status";

const toEnumList = (value: Record<string, string>) => ({
  enum: Object.keys(value) as [string, ...string[]],
});

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

export const events = sqliteTable(
  "events",
  {
    id,
    correlationId: text("correlationId").notNull(),
    createdAt: integer("createdAt").default(sql`now`).notNull(),
    name: text("name").notNull(),
    stream: text("stream").notNull(),
    version: integer("version").notNull(),
    revision: integer("revision").notNull().default(0),
    payload: text("payload").notNull(),
  },
  (table) => [
    index("stream_idx").on(table.stream),
    // cspell:disable-next-line
    uniqueIndex("stream_revision_uidx").on(table.stream, table.revision),
  ],
);

export const entries = sqliteTable("entries", {
  id,
  revision: integer("revision").notNull().default(0),
  startedAt: integer("startedAt").notNull(),
  finishedAt: integer("finishedAt"),
  situationDescription: text("situationDescription"),
  situationLocation: text("situationLocation"),
  situationKind: text("situationKind", toEnumList(SituationKindOptions)),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)),
  emotionIntensity: integer("emotionIntensity"),
  reactionDescription: text("reactionDescription"),
  reactionType: text("reactionType", toEnumList(GrossEmotionRegulationStrategy)),
  reactionEffectiveness: integer("reactionEffectiveness"),
  status: text("status", toEnumList(EntryStatusEnum)).notNull(),
  language: text("language").notNull(),
  weekIsoId: text("weekIsoId").notNull(),
  origin: text("origin", toEnumList(EntryOriginOption)).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

/** @public */
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
  id,
  scheduledAt: integer("scheduledAt").notNull(),
  scheduledFor: integer("scheduledFor").notNull(),
  situationDescription: text("situationDescription").notNull(),
  situationLocation: text("situationLocation").notNull(),
  situationKind: text("situationKind", toEnumList(SituationKindOptions)).notNull(),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)).notNull(),
  emotionIntensity: integer("emotionIntensity").notNull(),
  reactionDescription: text("reactionDescription").notNull(),
  reactionType: text("reactionType", toEnumList(GrossEmotionRegulationStrategy)).notNull(),
  reactionEffectiveness: integer("reactionEffectiveness").notNull(),
  language: text("language").notNull(),
  status: text("status", toEnumList(TimeCapsuleEntryStatusEnum)).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const alarms = sqliteTable("alarms", {
  id,
  generatedAt: integer("generatedAt").notNull(),
  entryId: text("entryId", { length: 36 }).references(() => entries.id, { onDelete: "cascade" }),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", toEnumList(AlarmStatusEnum)).notNull(),
  name: text("name", toEnumList(AlarmNameOption)).notNull(),
  advice: text("advice"),

  inactivityDays: integer("inactivityDays"),
  lastEntryTimestamp: integer("lastEntryTimestamp"),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)),
  emotionIntensity: integer("emotionIntensity"),

  weekIsoId: text("weekIsoId").notNull(),
});

/** @public */
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

/** @public */
export const patternDetections = sqliteTable("patternDetections", {
  id,
  createdAt: integer("createdAt").notNull(),
  name: text("name", toEnumList(PatternNameOption)).notNull(),
  weekIsoId: text("weekIsoId").notNull(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

/** @public */

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

/** @public */
export const weeklyReviews = sqliteTable("weeklyReviews", {
  id,
  createdAt: integer("createdAt").notNull(),
  weekIsoId: text("weekIsoId").notNull(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  insights: text("insights"),
  status: text("status", toEnumList(WeeklyReviewStatusEnum)).notNull(),
});

/** @public */
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

/** @public */
export const shareableLinks = sqliteTable("shareableLinks", {
  id,
  createdAt: integer("createdAt").notNull(),
  updatedAt: integer("updatedAt").notNull(),
  status: text("status", toEnumList(ShareableLinkStatusEnum)).notNull(),
  revision: integer("revision").notNull().default(0),
  ownerId: text("ownerId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  publicationSpecification: text("publicationSpecification").notNull(),
  dateRangeStart: integer("dateRangeStart").notNull(),
  dateRangeEnd: integer("dateRangeEnd").notNull(),
  durationMs: integer("durationMs").notNull(),
  expiresAt: integer("expiresAt").notNull(),
  hidden: integer("hidden", { mode: "boolean" }).default(false),
});

/** @public */
export const shareableLinksRelations = relations(shareableLinks, ({ one }) => ({
  /** the user who owns / created the link */
  owner: one(users, {
    fields: [shareableLinks.ownerId],
    references: [users.id],
    relationName: "userShareLinks", // optional, helps disambiguate joins
  }),
}));

/** @public */
export const aiUsageCounters = sqliteTable("ai_usage_counters", {
  bucket: text("bucket").primaryKey(),
  ruleId: text("ruleId").notNull(),
  window: text("window").notNull(),
  userId: text("userId", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  count: integer("count", { mode: "number" }).notNull().default(0),
  firstEventAt: integer("firstEventAt", { mode: "number" }),
  lastEventAt: integer("lastEventAt", { mode: "number" }),
});

export const history = sqliteTable(
  "history",
  {
    id,
    createdAt: integer("createdAt", { mode: "number" }).notNull(),
    subject: text("subject").notNull(),
    operation: text("operation").notNull(),
    payload: text("payload"),
  },
  (table) => [
    index("history_subject_createdAt").on(table.subject, desc(table.createdAt)),
    index("history_operation_createdAt").on(table.operation, desc(table.createdAt)),
    index("history_createdAt").on(desc(table.createdAt)),
  ],
);

/** @public */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => !1)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

/** @public */

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

/** @public */
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

/** @public */
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
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
});

/** @public */
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type SelectEntries = typeof entries.$inferSelect;
export type SelectEntriesFormatted = Omit<SelectEntries, "startedAt"> & { startedAt: string };
export type SelectEntriesWithAlarms = SelectEntries & { alarms: SelectAlarms[] };
export type SelectEntriesFull = Omit<SelectEntriesWithAlarms, "startedAt"> & { startedAt: string };
/** @public */
export type SelectEntriesFullWithAlarms = Omit<SelectEntriesWithAlarms, "startedAt"> & {
  startedAt: string;
} & { alarms: SelectAlarms[] };
export type SelectAlarms = typeof alarms.$inferSelect;
export type SelectPatternDetections = typeof patternDetections.$inferSelect;
export type SelectWeeklyReviews = typeof weeklyReviews.$inferSelect;
export type SelectShareableLinks = typeof shareableLinks.$inferSelect;
/** @public */
export type SelectTimeCapsuleEntries = typeof timeCapsuleEntries.$inferSelect;
