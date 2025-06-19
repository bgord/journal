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