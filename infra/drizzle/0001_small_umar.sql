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
	`reaction` text,
	`status` text NOT NULL
);
