CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"password" text,
	"username" text,
	"image" text
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_username_index" ON "users" ("username");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_index" ON "users" ("email");