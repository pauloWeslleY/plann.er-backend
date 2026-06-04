CREATE TYPE "public"."trip_status" AS ENUM('PLANNED', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "accounts" RENAME TO "accounts_table";--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "sessions_table";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "users_table";--> statement-breakpoint
ALTER TABLE "verifications" RENAME TO "verifications_table";--> statement-breakpoint
ALTER TABLE "sessions_table" DROP CONSTRAINT "sessions_token_unique";--> statement-breakpoint
ALTER TABLE "users_table" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "accounts_table" DROP CONSTRAINT "accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions_table" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "trips" DROP CONSTRAINT "trips_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "trips" ADD COLUMN "status" "trip_status" DEFAULT 'PLANNED' NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts_table" ADD CONSTRAINT "accounts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_table" ADD CONSTRAINT "sessions_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_table" ADD CONSTRAINT "sessions_table_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_email_unique" UNIQUE("email");