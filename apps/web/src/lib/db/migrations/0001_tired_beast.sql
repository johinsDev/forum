CREATE TABLE IF NOT EXISTS "sessions" (
	"user_id" integer NOT NULL,
	"sessionToken" text PRIMARY KEY NOT NULL,
	"expires" integer NOT NULL
);

ALTER TABLE "users" RENAME COLUMN "emailVerified" TO "email_verified";
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
