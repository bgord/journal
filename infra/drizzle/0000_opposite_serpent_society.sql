CREATE TABLE `event` (
	`id` text PRIMARY KEY DEFAULT uuid() NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`payload` text NOT NULL
);
