CREATE TABLE campaign_owners (campaign TEXT PRIMARY KEY NOT NULL, subject TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE action_receipts (
 campaign TEXT NOT NULL, id TEXT NOT NULL, subject TEXT NOT NULL,
 expected_revision INTEGER NOT NULL, fingerprint TEXT NOT NULL,
 response TEXT NOT NULL, next_state TEXT NOT NULL, next_revision INTEGER NOT NULL,
 text TEXT NOT NULL, status TEXT NOT NULL, created TEXT NOT NULL,
 PRIMARY KEY(campaign,id)
);
