CREATE TABLE `actions` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign` text NOT NULL,
	`text` text NOT NULL,
	`status` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`revision` integer NOT NULL
);
