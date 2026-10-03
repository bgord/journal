CREATE INDEX `ai_usage_counters_userId_idx` ON `ai_usage_counters` (`userId`);--> statement-breakpoint
CREATE INDEX `alarms_entryId_idx` ON `alarms` (`entryId`);--> statement-breakpoint
CREATE INDEX `alarms_userId_weekIsoId_idx` ON `alarms` (`userId`,`weekIsoId`);--> statement-breakpoint
CREATE INDEX `entries_userId_weekIsoId_idx` ON `entries` (`userId`,`weekIsoId`);--> statement-breakpoint
CREATE INDEX `patternDetections_userId_weekIsoId_idx` ON `patternDetections` (`userId`,`weekIsoId`);--> statement-breakpoint
CREATE INDEX `shareable_link_hits_shareableLinkId_idx` ON `shareable_link_hits` (`shareableLinkId`);--> statement-breakpoint
CREATE INDEX `shareable_link_hits_ownerId_idx` ON `shareable_link_hits` (`ownerId`);--> statement-breakpoint
CREATE INDEX `shareableLinks_ownerId_idx` ON `shareableLinks` (`ownerId`);--> statement-breakpoint
CREATE INDEX `timeCapsuleEntries_userId_idx` ON `timeCapsuleEntries` (`userId`);--> statement-breakpoint
CREATE INDEX `weeklyReviews_userId_weekIsoId_idx` ON `weeklyReviews` (`userId`,`weekIsoId`);