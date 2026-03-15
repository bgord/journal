PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_preferences` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`preference` text(2) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_preferences`("id", "userId", "preference", "value", "updatedAt") SELECT "id", "userId", "preference", "value", "updatedAt" FROM `user_preferences`;--> statement-breakpoint
DROP TABLE `user_preferences`;--> statement-breakpoint
ALTER TABLE `__new_user_preferences` RENAME TO `user_preferences`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_userId_preference_uidx` ON `user_preferences` (`userId`,`preference`);--> statement-breakpoint
CREATE INDEX `user_preferences_userId_idx` ON `user_preferences` (`userId`);--> statement-breakpoint
CREATE INDEX `user_preferences_preference_idx` ON `user_preferences` (`preference`);