CREATE TABLE `alarms` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`generatedAt` integer NOT NULL,
	`EntryId` text(36),
	`status` text NOT NULL,
	`name` text NOT NULL,
	`advice` text,
	FOREIGN KEY (`EntryId`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entries` (
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
	`reactionEffectiveness` integer,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`correlationId` text NOT NULL,
	`createdAt` integer DEFAULT now NOT NULL,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stream_idx` ON `events` (`stream`);