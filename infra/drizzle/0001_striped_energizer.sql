CREATE TABLE `alarms` (
	`id` text(36),
	`generatedAt` integer NOT NULL,
	`status` text NOT NULL,
	`name` text NOT NULL,
	`advice` text,
	FOREIGN KEY (`id`) REFERENCES `emotionJournalEntries`(`id`) ON UPDATE no action ON DELETE no action
);
