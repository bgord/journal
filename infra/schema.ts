import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { AlarmNameOption } from "../modules/emotions/value-objects/alarm-name-option";
import { AlarmStatusEnum } from "../modules/emotions/value-objects/alarm-status";
import { EntryStatusEnum } from "../modules/emotions/value-objects/entry-status";
import { GenevaWheelEmotion } from "../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import { GrossEmotionRegulationStrategy } from "../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";
import { PatternNameOption } from "../modules/emotions/value-objects/pattern-name-option";
// Imported separately because of Drizzle error in bgord-scripts/drizzle-generate.sh
import { SituationKindOptions } from "../modules/emotions/value-objects/situation-kind-options";

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
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

/** @public */
export const entriesRelations = relations(entries, ({ one, many }) => ({
  alarms: many(alarms),
  user: one(users, { fields: [entries.userId], references: [users.id] }),
}));

export const alarms = sqliteTable("alarms", {
  id,
  generatedAt: integer("generatedAt").notNull(),
  entryId: text("entryId", { length: 36 }).references(() => entries.id),
  userId: text("userId", { length: 36 })
    .references(() => entries.id)
    .notNull(),
  status: text("status", toEnumList(AlarmStatusEnum)).notNull(),
  name: text("name", toEnumList(AlarmNameOption)).notNull(),
  advice: text("advice"),

  inactivityDays: integer("inactivityDays"),
  lastEntryTimestamp: integer("lastEntryTimestamp"),
  emotionLabel: text("emotionLabel", toEnumList(GenevaWheelEmotion)),
  emotionIntensity: integer("emotionIntensity"),
});

/** @public */
export const alarmsRelations = relations(alarms, ({ one }) => ({
  entry: one(entries, { fields: [alarms.entryId], references: [entries.id] }),
  user: one(users, { fields: [alarms.userId], references: [users.id] }),
}));

export const patternDetections = sqliteTable("patternDetections", {
  id,
  createdAt: integer("createdAt").notNull(),
  name: text("name", toEnumList(PatternNameOption)).notNull(),
  weekIsoId: text("weekIsoId").notNull(),
  userId: text("userId", { length: 36 })
    .references(() => entries.id)
    .notNull(),
});

export const patternDetectionsRelations = relations(patternDetections, ({ one }) => ({
  user: one(users, { fields: [patternDetections.userId], references: [users.id] }),
}));

/** @public */
export const patternDetections = sqliteTable("patternDetections", {
  id,
  createdAt: integer("createdAt").notNull(),
  name: text("name", toEnumList(PatternNameOption)).notNull(),
  weekIsoId: text("weekIsoId").notNull(),
  userId: text("userId", { length: 36 })
    .references(() => entries.id)
    .notNull(),
});

/** @public */
export const patternDetectionsRelations = relations(patternDetections, ({ one }) => ({
  user: one(users, { fields: [patternDetections.userId], references: [users.id] }),
}));

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
  entries: many(entries),
  alarms: many(alarms),
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
export type SelectAlarms = typeof alarms.$inferSelect;
export type SelectPatternDetections = typeof patternDetections.$inferSelect;
