CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `alarms` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`generatedAt` integer NOT NULL,
	`entryId` text(36),
	`userId` text(36) NOT NULL,
	`status` text NOT NULL,
	`name` text NOT NULL,
	`advice` text,
	`inactivityDays` integer,
	`lastEntryTimestamp` integer,
	`emotionLabel` text,
	`emotionIntensity` integer,
	`weekIsoId` text NOT NULL,
	FOREIGN KEY (`entryId`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
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
	`status` text NOT NULL,
	`language` text NOT NULL,
	`weekIsoId` text NOT NULL,
	`origin` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`correlationId` text NOT NULL,
	`createdAt` integer DEFAULT now NOT NULL,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stream_idx` ON `events` (`stream`);--> statement-breakpoint
CREATE UNIQUE INDEX `stream_revision_uidx` ON `events` (`stream`,`revision`);--> statement-breakpoint
CREATE TABLE `patternDetections` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`name` text NOT NULL,
	`weekIsoId` text NOT NULL,
	`userId` text(36) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `shareableLinks` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`status` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`ownerId` text(36) NOT NULL,
	`publicationSpecification` text NOT NULL,
	`dateRangeStart` integer NOT NULL,
	`dateRangeEnd` integer NOT NULL,
	`durationMs` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	`hidden` integer DEFAULT false,
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `timeCapsuleEntries` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`scheduledAt` integer NOT NULL,
	`scheduledFor` integer NOT NULL,
	`situationDescription` text NOT NULL,
	`situationLocation` text NOT NULL,
	`situationKind` text NOT NULL,
	`emotionLabel` text NOT NULL,
	`emotionIntensity` integer NOT NULL,
	`reactionDescription` text NOT NULL,
	`reactionType` text NOT NULL,
	`reactionEffectiveness` integer NOT NULL,
	`language` text NOT NULL,
	`status` text NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `weeklyReviews` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`weekIsoId` text NOT NULL,
	`userId` text(36) NOT NULL,
	`insights` text,
	`status` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
