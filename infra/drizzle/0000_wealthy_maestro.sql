CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT now,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`payload` text NOT NULL
);
