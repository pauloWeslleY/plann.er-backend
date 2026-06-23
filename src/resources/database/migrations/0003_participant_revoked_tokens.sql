CREATE TABLE "participant_revoked_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
