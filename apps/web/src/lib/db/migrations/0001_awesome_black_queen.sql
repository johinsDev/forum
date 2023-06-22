ALTER TABLE "users" ADD COLUMN "username" text;
CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" ("username");