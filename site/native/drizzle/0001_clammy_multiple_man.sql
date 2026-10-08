CREATE TABLE `action_receipts` (
	`campaign` text NOT NULL,
	`id` text NOT NULL,
	`subject` text NOT NULL,
	`expected_revision` integer NOT NULL,
	`fingerprint` text NOT NULL,
	`response` text NOT NULL,
	`next_state` text NOT NULL,
	`next_revision` integer NOT NULL,
	`text` text NOT NULL,
	`status` text NOT NULL,
	`created` text NOT NULL,
	PRIMARY KEY(`campaign`, `id`)
);
--> statement-breakpoint
CREATE TABLE `campaign_owners` (
	`campaign` text PRIMARY KEY NOT NULL,
	`subject` text NOT NULL
);
