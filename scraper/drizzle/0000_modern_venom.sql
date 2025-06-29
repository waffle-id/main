CREATE TABLE `scraped_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`full_name` text,
	`bio` text,
	`avatar_url` text,
	`followers` text,
	`url` text NOT NULL,
	`last_scraped` integer DEFAULT CURRENT_TIMESTAMP,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scraped_profiles_username_unique` ON `scraped_profiles` (`username`);