ALTER TABLE "topics" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "updatedAt" SET DEFAULT now();