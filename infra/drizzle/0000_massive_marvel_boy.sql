CREATE TABLE `emotionJournalEntries` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`startedAt` integer NOT NULL,
	`finishedAt` integer,
	`situationDescription` text,
	`situationLocation` text,
	`situationKind` text,
	`emotionLabel` text,
	`emotionIntensity` integer,
	`reactionDescription` text,
	`reactionType` text,
	`reactionEffectiveness` text,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT now NOT NULL,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stream_idx` ON `events` (`stream`);