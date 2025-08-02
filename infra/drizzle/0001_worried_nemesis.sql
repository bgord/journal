PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_patternDetections` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`name` text NOT NULL,
	`weekIsoId` text NOT NULL,
	`userId` text(36) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_patternDetections`("id", "createdAt", "name", "weekIsoId", "userId") SELECT "id", "createdAt", "name", "weekIsoId", "userId" FROM `patternDetections`;--> statement-breakpoint
DROP TABLE `patternDetections`;--> statement-breakpoint
ALTER TABLE `__new_patternDetections` RENAME TO `patternDetections`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_shareableLinks` (
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
	FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_shareableLinks`("id", "createdAt", "updatedAt", "status", "revision", "ownerId", "publicationSpecification", "dateRangeStart", "dateRangeEnd", "durationMs", "expiresAt") SELECT "id", "createdAt", "updatedAt", "status", "revision", "ownerId", "publicationSpecification", "dateRangeStart", "dateRangeEnd", "durationMs", "expiresAt" FROM `shareableLinks`;--> statement-breakpoint
DROP TABLE `shareableLinks`;--> statement-breakpoint
ALTER TABLE `__new_shareableLinks` RENAME TO `shareableLinks`;