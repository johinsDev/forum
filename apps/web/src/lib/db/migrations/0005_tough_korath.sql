ALTER TABLE "sessions" ADD COLUMN "expired_at" timestamp NOT NULL;
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "expires";